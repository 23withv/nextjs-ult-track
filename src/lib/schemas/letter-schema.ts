import { z } from "zod";

export const createLetterSchema = z.object({
  targetUnit: z.string().min(1, "Unit tujuan wajib dipilih"),
  customTargetUnitDetail: z.string().optional(),
  type: z.string().min(1, "Jenis surat wajib dipilih"),
  customTypeDetail: z.string().optional(),
  mahasiswaNote: z.string().optional(),
})
.refine(
  (data) => !(data.targetUnit === "Lainnya" && (!data.customTargetUnitDetail || data.customTargetUnitDetail.trim() === "")),
  { message: "Detail unit tujuan wajib diisi jika memilih Lainnya", path: ["customTargetUnitDetail"] }
)
.refine(
  (data) => !(data.type === "Lainnya" && (!data.customTypeDetail || data.customTypeDetail.trim() === "")),
  { message: "Detail jenis surat wajib diisi jika memilih Lainnya", path: ["customTypeDetail"] }
);

export type CreateLetterInput = z.infer<typeof createLetterSchema>;