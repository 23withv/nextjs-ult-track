import { connectDB } from "@/lib/db";
import LetterModel from "@/models/Letter";
import MahasiswaModel from "@/models/Mahasiswa";
import { CreateLetterInput } from "@/lib/schemas/letter-schema";
import { APIHandler, successRes } from "@/lib/api-handler";

export const createLetterServer = async (userId: string, payload: CreateLetterInput) => {
  return await APIHandler(async () => {
    await connectDB();

    const currentUser = await MahasiswaModel.findById(userId).select("_id nim name prodi").lean();
    if (!currentUser) throw new Error("Akses ditolak: Data pengguna tidak ditemukan");

    const prodiName = currentUser.prodi;
    const prodiCode = prodiName.split(' ').map(word => word[0]).join('').toUpperCase();

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.floor(1000 + Math.random() * 9000);

    const trackingNumber = `${prodiCode}-${dateStr}-${randomHex}`;

    await LetterModel.create({
      mahasiswaInfo: {
        _id: currentUser._id,
        nim: currentUser.nim,
        name: currentUser.name,
      },
      targetUnit: payload.targetUnit,
      customTargetUnitDetail: payload.customTargetUnitDetail,
      type: payload.type,
      customTypeDetail: payload.customTypeDetail,
      letterNumber: trackingNumber,
      delegateInfo: null,
      status: "Diajukan",
    });

    return successRes("Surat berhasil diajukan", 201);
  });
};

export const getMahasiswaLetterListServer = async (userId: string) => {
  return await APIHandler(async () => {
    await connectDB();

    const user = await MahasiswaModel.findById(userId).select("nim").lean();
    if (!user) throw new Error("Akses ditolak: Data pengguna tidak ditemukan");
    
    const userNim = user.nim;

    const letters = await LetterModel.find({
      $or: [
        { "mahasiswaInfo.nim": userNim },
        { "delegateInfo.nim": userNim }
      ]
    })
    .select("_id targetUnit customTargetUnitDetail type customTypeDetail status createdAt documentUrl adminNotes delegateInfo")
    .sort({ createdAt: -1 })
    .lean();

    const formattedData = letters.map((l) => ({
      ...l,
      _id: String(l._id),
      targetUnit: l.targetUnit === "Lainnya" ? l.customTargetUnitDetail : l.targetUnit,
      type: l.type === "Lainnya" ? l.customTypeDetail : l.type,
    }));

    return successRes("Data persuratan berhasil dimuat", 200, formattedData);
  });
};