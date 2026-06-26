import { signIn } from "next-auth/react";
import { APIHandler, SetError, successRes } from "@/lib/api-handler";
import { validate } from "@/lib/zod-validator";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/auth-schema";

export type LoginInput = z.infer<typeof loginSchema>;

export const loginUser = async (payload: LoginInput) => {
  return await APIHandler(async () => {
    // Validasi struktur payload menggunakan skema Zod
    const validatedData = validate(loginSchema, payload);

    // Panggil NextAuth untuk proses otentikasi kredensial
    const res = await signIn("credentials", {
      id: validatedData.id,
      password: validatedData.password,
      redirect: false,
    });

    if (res?.error) {
      throw new SetError("NIM/NIP atau Password salah", 401);
    }
    return successRes("Berhasil masuk", 200);
  });
};
