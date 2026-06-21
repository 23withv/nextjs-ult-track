import mongoose, { Schema, Model } from "mongoose";
import { ILetter } from "@/types/models";

const LetterSchema = new Schema<ILetter>(
  {
    mahasiswaId: {
      type: Schema.Types.ObjectId,
      ref: "Mahasiswa",
      required: true,
    },
    type: { type: String, required: true, trim: true },
    purpose: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Diajukan", "Diproses", "Siap Diambil", "Selesai"],
      default: "Diajukan",
    },
    verificationCode: { type: String, required: true, trim: true },
    delegatedTo: {
      type: Schema.Types.ObjectId,
      ref: "Mahasiswa",
      default: null,
    },
    rejectionReason: { type: String, default: null, trim: true },
  },
  { timestamps: true },
);

LetterSchema.index({ mahasiswaId: 1, status: 1 });
LetterSchema.index({ delegatedTo: 1 });

const LetterModel: Model<ILetter> =
  mongoose.models.Letter || mongoose.model<ILetter>("Letter", LetterSchema);

export default LetterModel;