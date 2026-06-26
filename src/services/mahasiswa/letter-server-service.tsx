import { connectDB } from "@/lib/db";
import LetterModel from "@/models/Letter";
import MahasiswaModel from "@/models/Mahasiswa";
import { CreateLetterInput } from "@/lib/schemas/letter-schema";
import { APIHandler, SetError, successRes } from "@/lib/api-handler";
import HandoverLogModel from "@/models/HandoverLog";

export const createLetterServer = async (userId: string, payload: CreateLetterInput) => {
  return await APIHandler(async () => {
    await connectDB();

    // Jalankan query MongoDB untuk validasi profil pemohon surat
    const currentUser = await MahasiswaModel.findById(userId).select("_id nim name prodi").lean();
    if (!currentUser) throw new Error("Akses ditolak: Data pengguna tidak ditemukan");

    const prodiName = currentUser.prodi;
    const prodiCode = prodiName.split(' ').map(word => word[0]).join('').toUpperCase();

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.floor(1000 + Math.random() * 9000);

    const trackingNumber = `${prodiCode}-${dateStr}-${randomHex}`;

    // Jalankan eksekusi query penyimpanan dokumen surat baru ke MongoDB
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
      mahasiswaNote: payload.mahasiswaNote,
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

    // Jalankan query pencarian riwayat surat berdasarkan NIM pemohon
    const letters = await LetterModel.find({ "mahasiswaInfo.nim": userNim })
    .select("_id targetUnit customTargetUnitDetail type customTypeDetail mahasiswaNote status createdAt")
    .sort({ createdAt: -1 })
    .lean();

    const formattedData = letters.map((l) => ({
      ...l,
      _id: String(l._id),
      targetUnit: l.targetUnit === "Lainnya" ? l.customTargetUnitDetail : l.targetUnit,
      type: l.type === "Lainnya" ? l.customTypeDetail : l.type,
      mahasiswaNote: l.mahasiswaNote || "-",
    }));

    return successRes("Data persuratan berhasil dimuat", 200, formattedData);
  });
};

export const getMahasiswaLetterDetailServer = async (userId: string, letterId: string) => {
  return await APIHandler(async () => {
    await connectDB();

    const user = await MahasiswaModel.findById(userId).select("nim").lean();
    if (!user) throw new Error("Akses ditolak: Data pengguna tidak ditemukan");

    // Jalankan query MongoDB untuk verifikasi akses surat (pemohon/delegasi)
    const letter = await LetterModel.findOne({
      _id: letterId,
      $or: [
        { "mahasiswaInfo.nim": user.nim },
        { "delegateInfo.nim": user.nim }
      ]
    }).lean();

    if (!letter) {
      throw new SetError("Dokumen tidak ditemukan atau Anda tidak memiliki akses", 404);
    }

    let handoverLog = null;
    if (letter.status === "Selesai") {
      handoverLog = await HandoverLogModel.findOne({ letterId: letter._id }).lean();
    }

    const formattedData = {
      letter: {
        ...letter,
        _id: String(letter._id),
        targetUnit: letter.targetUnit === "Lainnya" ? letter.customTargetUnitDetail : letter.targetUnit,
        type: letter.type === "Lainnya" ? letter.customTypeDetail : letter.type,
      },
      handover: handoverLog ? {
        ...handoverLog,
        _id: String(handoverLog._id),
        letterId: String(handoverLog.letterId),
        processedBy: String(handoverLog.processedBy),
      } : null,
    };

    return successRes("Detail dokumen berhasil dimuat", 200, formattedData);
  });
};

export const assignDelegateServer = async (userId: string, letterId: string, delegateNim: string) => {
  return await APIHandler(async () => {
    await connectDB();

    const user = await MahasiswaModel.findById(userId).select("nim").lean();
    if (!user) throw new SetError("Akses ditolak: Data pengguna tidak ditemukan", 401);

    if (user.nim === delegateNim) {
      throw new SetError("Tidak dapat menunjuk diri sendiri sebagai delegasi", 400);
    }

    const letter = await LetterModel.findOne({
      _id: letterId,
      "mahasiswaInfo.nim": user.nim
    });

    if (!letter) throw new SetError("Dokumen tidak ditemukan", 404);
    if (letter.status !== "Siap Diambil") throw new SetError("Dokumen belum siap diambil", 400);

    // Jalankan query MongoDB untuk memvalidasi data mahasiswa penerima delegasi
    const delegate = await MahasiswaModel.findOne({ nim: delegateNim }).select("_id nim name").lean();
    if (!delegate) throw new SetError("Mahasiswa delegasi tidak ditemukan", 404);

    // Jalankan query update penambahan delegasi pada dokumen surat
    await LetterModel.findByIdAndUpdate(letterId, {
      delegateInfo: {
        _id: delegate._id,
        nim: delegate.nim,
        name: delegate.name
      }
    });

    return successRes("Delegasi berhasil ditunjuk", 200);
  });
};

export const getDelegatedLettersServer = async (userId: string) => {
  return await APIHandler(async () => {
    await connectDB();

    const user = await MahasiswaModel.findById(userId).select("nim").lean();
    if (!user) throw new Error("Akses ditolak: Data pengguna tidak ditemukan");

    // Jalankan query MongoDB untuk mengambil daftar surat yang didelegasikan
    const letters = await LetterModel.find({ "delegateInfo.nim": user.nim })
    .select("_id letterNumber mahasiswaInfo targetUnit customTargetUnitDetail type customTypeDetail status createdAt")
    .sort({ createdAt: -1 })
    .lean();

    const formattedData = letters.map((l) => ({
      _id: String(l._id),
      letterNumber: l.letterNumber || "-",
      pemohonName: l.mahasiswaInfo.name,
      pemohonNim: l.mahasiswaInfo.nim,
      targetUnit: l.targetUnit === "Lainnya" ? l.customTargetUnitDetail : l.targetUnit,
      type: l.type === "Lainnya" ? l.customTypeDetail : l.type,
      status: l.status,
      createdAt: (l.createdAt as Date).toISOString(),
    }));

    return successRes("Daftar delegasi berhasil dimuat", 200, formattedData);
  });
};