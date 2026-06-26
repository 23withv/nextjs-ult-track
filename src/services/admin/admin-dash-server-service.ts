import { connectDB } from "@/lib/db";
import { Types } from "mongoose";
import LetterModel from "@/models/Letter";
import MahasiswaModel from "@/models/Mahasiswa";
import UnitModel from "@/models/Unit";
import LetterTypeModel from "@/models/LetterType";
import { APIHandler, successRes } from "@/lib/api-handler";
import { 
  IAdminDashboardRes, 
  ILineChartData, 
  IPieChartData, 
  ILatestLetter 
} from "@/types/response/admin/admin-dash";

interface IRawLetterPeriod {
  status: string;
  createdAt: Date;
}

interface IRawLatestLetter {
  _id: Types.ObjectId;
  letterNumber?: string;
  mahasiswaInfo?: {
    name: string;
    nim: string;
  };
  targetUnit: string;
  type: string;
  status: string;
  createdAt: Date;
}

export const getAdminDashboardStatsServer = async (year: number, month?: number) => {
  return await APIHandler(async () => {
    await connectDB();

    const startDate = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1);
    const endDate = month ? new Date(year, month, 0, 23, 59, 59) : new Date(year, 11, 31, 23, 59, 59);

    const dateQuery = { createdAt: { $gte: startDate, $lte: endDate } };
    
    // Jalankan query MongoDB untuk agregasi hitungan dokumen dashboard
    const [totalUnit, totalLetterType, totalLetter, totalMahasiswa] = await Promise.all([
      UnitModel.countDocuments({ isDeleted: false }),
      LetterTypeModel.countDocuments({ isDeleted: false }),
      LetterModel.countDocuments(dateQuery),
      MahasiswaModel.countDocuments({ isActive: true }),
    ]);

    const lettersThisPeriod = await LetterModel.find(dateQuery)
      .select("status createdAt")
      .lean() as IRawLetterPeriod[];

    const lineChartData: ILineChartData[] = month
      ? Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => ({
          name: String(i + 1),
          Diajukan: 0, Diproses: 0, "Siap Diambil": 0, Selesai: 0, Ditolak: 0
        }))
      : ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"].map(name => ({
          name, Diajukan: 0, Diproses: 0, "Siap Diambil": 0, Selesai: 0, Ditolak: 0
        }));

    lettersThisPeriod.forEach(l => {
      const createdDate = l.createdAt instanceof Date ? l.createdAt : new Date(l.createdAt);
      const targetIdx = month ? createdDate.getDate() - 1 : createdDate.getMonth();
      
      const status = l.status as keyof Omit<ILineChartData, "name">;
      
      if (lineChartData[targetIdx] && typeof lineChartData[targetIdx][status] === "number") {
         lineChartData[targetIdx][status] += 1;
      }
    });

    const pieChartRaw = await LetterModel.aggregate<{ _id: string; value: number }>([
      { $match: dateQuery },
      { $group: { _id: "$targetUnit", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 6 }
    ]);

    const pieChartData: IPieChartData[] = pieChartRaw.map(item => ({ 
      name: String(item._id || "Lainnya"), 
      value: Number(item.value) 
    }));

    const latestLettersRaw = await LetterModel.find(dateQuery)
      .select("_id letterNumber mahasiswaInfo targetUnit type status createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean() as IRawLatestLetter[];

    const latestLetters: ILatestLetter[] = latestLettersRaw.map((l) => ({
      _id: String(l._id),
      letterNumber: String(l.letterNumber || "-"),
      mahasiswaName: String(l.mahasiswaInfo?.name || "-"),
      mahasiswaNim: String(l.mahasiswaInfo?.nim || "-"),
      targetUnit: String(l.targetUnit || "-"),
      type: String(l.type || "-"),
      status: String(l.status || "Diajukan"),
      createdAt: l.createdAt instanceof Date ? l.createdAt.toISOString() : new Date(l.createdAt).toISOString(),
    }));

    const earliestLetter = await LetterModel.findOne()
      .sort({ createdAt: 1 })
      .select("createdAt")
      .lean() as { createdAt: Date } | null;

    const minYear = earliestLetter?.createdAt instanceof Date 
      ? earliestLetter.createdAt.getFullYear() 
      : year;

    const availableYears: number[] = [];
    for (let y = new Date().getFullYear(); y >= minYear; y--) {
      availableYears.push(y);
    }

    const responsePayload: IAdminDashboardRes = {
      stats: { totalUnit, totalLetterType, totalLetter, totalMahasiswa },
      lineChart: lineChartData,
      pieChart: pieChartData,
      latestLetters,
      availableYears,
      isMonthView: !!month
    };

    return successRes("Dashboard stats loaded", 200, responsePayload);
  });
};