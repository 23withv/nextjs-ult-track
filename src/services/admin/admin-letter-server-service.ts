import { connectDB } from "@/lib/db";
import LetterModel from "@/models/Letter";
import { APIHandler, successRes } from "@/lib/api-handler";

export const getAdminLetterListServer = async (
  page: number = 1,
  limit: number = 10,
  statusFilter?: string
) => {
  return await APIHandler(async () => {
    await connectDB();

    const query: Record<string, unknown> = {};
    if (statusFilter && statusFilter !== "All") {
      query.status = statusFilter;
    }

    const skip = (page - 1) * limit;

    const [data, totalDocuments] = await Promise.all([
      LetterModel.find(query)
        .select("_id letterNumber mahasiswaInfo targetUnit customTargetUnitDetail type customTypeDetail status createdAt")
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
      status: d.status,
      createdAt: (d.createdAt as Date).toISOString(),
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