"use server";

import { connectDB } from "@/lib/db";
import MahasiswaModel from "@/models/Mahasiswa";
import { APIHandler, successRes } from "@/lib/api-handler";
import { validate } from "@/lib/zod-validator";
import {
  registerMahasiswaSchema,
  RegisterMahasiswaInput,
} from "@/lib/schemas/mahasiswa-schema";
import bcrypt from "bcryptjs";
import { MahasiswaListItem } from "@/types/response/admin/mahasiswa";

export const registerMahasiswaServer = async (
  payload: RegisterMahasiswaInput,
) => {
  return await APIHandler(async () => {
    const validatedData = validate(registerMahasiswaSchema, payload);
    await connectDB();
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    await MahasiswaModel.create({
      nim: validatedData.nim,
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      jurusan: validatedData.jurusan,
      prodi: validatedData.prodi,
    });

    return successRes("Pendaftaran akun berhasil", 201);
  });
};

export const getMahasiswaListServer = async (
  page: number = 1,
  limit: number = 10,
) => {
  return await APIHandler(async () => {
    await connectDB();

    const skip = (page - 1) * limit;

    const [data, totalDocuments] = await Promise.all([
      MahasiswaModel.find()
        .select("_id nim name email jurusan prodi isActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MahasiswaModel.countDocuments(),
    ]);

    const formattedData: MahasiswaListItem[] = data.map((d) => ({
      _id: String(d._id),
      nim: String(d.nim),
      name: String(d.name),
      email: String(d.email),
      jurusan: String(d.jurusan),
      prodi: String(d.prodi),
      isActive: Boolean(d.isActive),
    }));

    return successRes("Berhasil memuat daftar mahasiswa", 200, {
      list: formattedData,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalItems: totalDocuments,
      },
    });
  });
};
