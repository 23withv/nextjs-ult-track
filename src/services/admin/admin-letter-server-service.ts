import { connectDB } from "@/lib/db";
import LetterModel from "@/models/Letter";
import { APIHandler, SetError, successRes } from "@/lib/api-handler";
import HandoverLogModel from "@/models/HandoverLog";

export const getAdminLetterListServer = async (
  page: number = 1,
  limit: number = 10,
  statusFilter?: string,
  resi?: string
) => {
  return await APIHandler(async () => {
    await connectDB();

    const query: Record<string, unknown> = {};
    if (statusFilter && statusFilter !== "All") {
      query.status = statusFilter;
    }

    if (resi) {
      query.letterNumber = { $regex: resi, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [data, totalDocuments] = await Promise.all([
      LetterModel.find(query)
        .select("_id letterNumber mahasiswaInfo delegateInfo targetUnit customTargetUnitDetail type customTypeDetail mahasiswaNote status createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LetterModel.countDocuments(query),
    ]);

    const formattedData = data.map((d) => ({
      _id: String(d._id),
      letterNumber: String(d.letterNumber || "-"),
      mahasiswaNim: String(d.mahasiswaInfo?.nim || "-"),
      mahasiswaName: String(d.mahasiswaInfo?.name || "-"),
      targetUnit: d.targetUnit === "Lainnya" ? String(d.customTargetUnitDetail || "Lainnya") : d.targetUnit,
      type: d.type === "Lainnya" ? String(d.customTypeDetail || "Lainnya") : d.type,
      mahasiswaNote: d.mahasiswaNote || "-",
      status: d.status,
      createdAt: (d.createdAt as Date).toISOString(),
      delegateInfo: d.delegateInfo || null,
    }));

    return successRes("Berhasil memuat daftar surat admin", 200, {
      list: formattedData,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalItems: totalDocuments,
      },
    });
  });
};

export const updateLetterStatusServer = async (
  letterId: string,
  payload: { status: string; adminNotes?: string; rejectionReason?: string | null }
) => {
  return await APIHandler(async () => {
    await connectDB();

    if (payload.status === "Ditolak" && (!payload.rejectionReason || payload.rejectionReason.trim() === "")) {
      throw new SetError("Alasan penolakan wajib diisi untuk status Ditolak", 400);
    }

    const updatedLetter = await LetterModel.findByIdAndUpdate(
      letterId,
      {
        status: payload.status,
        adminNotes: payload.adminNotes || null,
        rejectionReason: payload.status === "Ditolak" ? payload.rejectionReason : null,
      },
      { new: true }
    );

    if (!updatedLetter) {
      throw new SetError("Data surat tidak ditemukan", 404);
    }

    return successRes("Status dokumen berhasil diperbarui", 200);
  });
};

export const getAdminLetterStatsServer = async () => {
  return await APIHandler(async () => {
    await connectDB();

    const stats = await LetterModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      diproses: 0,
      siap: 0,
      riwayat: 0,
    };

    stats.forEach(stat => {
      formattedStats.total += stat.count;
      if (stat._id === "Diajukan" || stat._id === "Diproses") {
        formattedStats.diproses += stat.count;
      } else if (stat._id === "Siap Diambil") {
        formattedStats.siap += stat.count;
      } else if (stat._id === "Selesai" || stat._id === "Ditolak") {
        formattedStats.riwayat += stat.count;
      }
    });

    return successRes("Berhasil memuat statistik admin", 200, formattedStats);
  });
};

export const getAdminLetterDetailServer = async (letterId: string) => {
  return await APIHandler(async () => {
    await connectDB();

    const letter = await LetterModel.findById(letterId).lean();
    if (!letter) throw new SetError("Surat tidak ditemukan", 404);

    let handoverLog = null;
    if (letter.status === "Selesai") {
      handoverLog = await HandoverLogModel.findOne({ letterId: letter._id }).lean();
    }

    return successRes("Data detail surat dimuat", 200, {
      letter: { ...letter, _id: String(letter._id) },
      handover: handoverLog ? { ...handoverLog, _id: String(handoverLog._id) } : null,
    });
  });
};