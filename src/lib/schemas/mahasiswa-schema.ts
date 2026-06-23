import { z } from "zod";

export const registerMahasiswaSchema = z.object({
  nim: z.string().min(5, "NIM minimal 5 karakter"),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  jurusan: z.string().min(2, "Jurusan wajib dipilih"),
  prodi: z.string().min(2, "Program studi wajib dipilih"),
});

export type RegisterMahasiswaInput = z.infer<typeof registerMahasiswaSchema>;