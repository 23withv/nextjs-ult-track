"use server";

import { connectDB } from "@/lib/db";
import MahasiswaModel from "@/models/Mahasiswa";
import { APIHandler, successRes } from "@/lib/api-handler";
import { validate } from "@/lib/zod-validator";
import { registerMahasiswaSchema, RegisterMahasiswaInput } from "@/lib/schemas/mahasiswa-schema";
import bcrypt from "bcryptjs";
import { MahasiswaListItem } from "@/types/response/mahasiswa";

export const registerMahasiswaServer = async (payload: RegisterMahasiswaInput) => {
  return await APIHandler(async () => {
    const validatedData = validate(registerMahasiswaSchema, payload);
      await connectDB();
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      await MahasiswaModel.create({
        nim: validatedData.nim,
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        prodi: validatedData.prodi,
      });

      return successRes("Pendaftaran akun berhasil", 201);
  });
};

export const getMahasiswaListServer = async () => {
  return await APIHandler(async () => {
      await connectDB();

      const data = await MahasiswaModel.find()
        .select("_id nim name email prodi isActive")
        .sort({ createdAt: -1 })
        .lean();

      const formattedData: MahasiswaListItem[] = data.map((d) => ({
        _id: String(d._id),
        nim: String(d.nim),
        name: String(d.name),
        email: String(d.email),
        prodi: String(d.prodi),
        isActive: Boolean(d.isActive),
      }));

      return successRes("Berhasil memuat daftar mahasiswa", 200, formattedData);
  });
};