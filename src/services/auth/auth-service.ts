import { signIn } from "next-auth/react";
import { APIHandler, SetError, successRes } from "@/lib/api-handler";
import { validate } from "@/lib/zod-validator";
import { z } from "zod";

export const loginSchema = z.object({
  id: z.string().min(3, "NIM/NIP wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginUser = async (payload: LoginInput) => {
  return await APIHandler(async () => {
    const validatedData = validate(loginSchema, payload);

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