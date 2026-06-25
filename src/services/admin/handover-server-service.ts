import { connectDB } from "@/lib/db";
import LetterModel from "@/models/Letter";
import HandoverLogModel from "@/models/HandoverLog";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { APIHandler, SetError, successRes } from "@/lib/api-handler";

export const processHandoverServer = async (
  adminId: string,
  payload: {
    letterId: string;
    takenByOption: "pemohon_langsung" | "delegasi";
    receiverNim: string;
    receiverName: string;
    file: File | null;
  }
) => {
  return await APIHandler(async () => {
    await connectDB();

    const letter = await LetterModel.findById(payload.letterId);
    if (!letter) throw new SetError("Dokumen tidak ditemukan", 404);
    if (letter.status !== "Siap Diambil") {
      throw new SetError("Dokumen belum siap diambil", 400);
    }

    let uploadedData: { url: string; publicId: string } | null = null;

    if (payload.file) {
      uploadedData = await uploadToCloudinary(payload.file, "handover_log");
    }

    try {
      await HandoverLogModel.create({
        letterId: payload.letterId,
        takenByOption: payload.takenByOption,
        receiverInfo: {
          _id: adminId, 
          nim: payload.receiverNim,
          name: payload.receiverName,
        },
        evidenceUrl: uploadedData?.url || undefined,
        evidencePublicId: uploadedData?.publicId || undefined,
        processedBy: adminId,
      });

      await LetterModel.findByIdAndUpdate(payload.letterId, {
        status: "Selesai",
      });

      return successRes("Dokumen berhasil diserahkan", 200);

    } catch (error) {
      console.error("[HANDOVER_DB_ERROR]", error);

      if (uploadedData?.publicId) {
        await deleteFromCloudinary(uploadedData.publicId);
        console.log(`[ROLLBACK] Gambar ${uploadedData.publicId} dihapus karena kegagalan database.`);
      }
      throw new SetError("Gagal menyimpan data serah terima ke sistem", 500);
    }
  });
};