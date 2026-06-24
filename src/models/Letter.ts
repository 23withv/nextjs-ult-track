import mongoose, { Schema, Model } from "mongoose";
import { ILetter } from "@/types/models";

const MahasiswaInfoSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "Mahasiswa", required: true },
    nim: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const LetterSchema = new Schema<ILetter>(
  {
    mahasiswaInfo: { type: MahasiswaInfoSchema, required: true},
    targetUnit: { type: String, required: true },
    customTargetUnitDetail: { type: String, default: null, trim: true },
    type: { type: String, required: true },
    customTypeDetail: { type: String, default: null, trim: true },
    letterNumber: { type: String, default: null, trim: true },
    status: {
      type: String,
      enum: ["Diajukan", "Diproses", "Siap Diambil", "Selesai", "Ditolak"],
      default: "Diajukan",
    },
    documentUrl: { type: String, default: null },
    adminNotes: { type: String, default: null, trim: true },
    delegateInfo: { type: MahasiswaInfoSchema, default: null},
    rejectionReason: { type: String, default: null, trim: true },
  },
  { timestamps: true },
);

LetterSchema.index({ "mahasiswaInfo.nim": 1, status: 1 });
LetterSchema.index({ "delegateInfo.nim": 1 });
LetterSchema.index({ letterNumber: 1 });

const LetterModel: Model<ILetter> =
  mongoose.models.Letter || mongoose.model<ILetter>("Letter", LetterSchema);

export default LetterModel;