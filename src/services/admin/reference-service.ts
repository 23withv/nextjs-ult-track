import { connectDB } from "@/lib/db";
import UnitModel from "@/models/Unit";
import LetterTypeModel from "@/models/LetterType";
import { APIHandler, successRes, SetError } from "@/lib/api-handler";

export const getReferenceListServer = async (type: "unit" | "letterType") => {
  return await APIHandler(async () => {
    await connectDB();
    const Model = type === "unit" ? UnitModel : LetterTypeModel;

    // Jalankan query pencarian dokumen referensi yang aktif di MongoDB
    const data = await Model.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean();
    return successRes("Data referensi berhasil dimuat", 200, data);
  });
};

export const createReferenceServer = async (type: "unit" | "letterType", name: string) => {
  return await APIHandler(async () => {
    await connectDB();
    const Model = type === "unit" ? UnitModel : LetterTypeModel;
    
    // Validasi struktur payload menggunakan skema Zod
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new SetError("Nama referensi tidak valid", 400);
    }
    
    // Jalankan query validasi duplikasi referensi di MongoDB
    const exists = await Model.findOne({ name, isDeleted: { $ne: true } });
    if (exists) throw new SetError("Nama referensi sudah terdaftar", 400);
    
    // Jalankan query insert referensi baru ke MongoDB
    await Model.create({ name, isDeleted: false });
    return successRes("Data referensi berhasil ditambahkan", 201);
  });
};

export const softDeleteReferenceServer = async (type: "unit" | "letterType", id: string) => {
  return await APIHandler(async () => {
    await connectDB();
    const Model = type === "unit" ? UnitModel : LetterTypeModel;

    // Validasi struktur payload menggunakan skema Zod
    if (!id || typeof id !== "string") {
      throw new SetError("ID referensi tidak valid", 400);
    }

    // Jalankan query update untuk soft delete referensi di MongoDB
    const result = await Model.findByIdAndUpdate(id, { isDeleted: true });
    if (!result) throw new SetError("Data referensi tidak ditemukan", 404);
    return successRes("Data berhasil dihapus", 200);
  });
};