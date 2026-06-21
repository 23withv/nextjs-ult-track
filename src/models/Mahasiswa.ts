import mongoose, { Schema, Model } from "mongoose";
import { IMahasiswa } from "@/types/models";

const MahasiswaSchema = new Schema<IMahasiswa>(
  {
    nim: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    prodi: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const MahasiswaModel: Model<IMahasiswa> =
  mongoose.models.Mahasiswa ||
  mongoose.model<IMahasiswa>("Mahasiswa", MahasiswaSchema);

export default MahasiswaModel;