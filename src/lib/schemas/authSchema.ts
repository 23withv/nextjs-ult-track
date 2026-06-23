import { z } from "zod";

export const loginSchema = z.object({
  id: z.string().min(3, {
message: "NIM/NIP minimal 3 karakter.",
  }),
  password: z.string().min(8, {
    message: "Password minimal 8 karakter.",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;