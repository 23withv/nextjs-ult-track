import mongoose, { Schema, Model } from "mongoose";
import { ILetterType } from "@/types/models";

const LetterTypeSchema = new Schema<ILetterType>({
  name: { type: String, required: true, unique: true, trim: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const LetterTypeModel: Model<ILetterType> = mongoose.models.LetterType || mongoose.model<ILetterType>("LetterType", LetterTypeSchema);
export default LetterTypeModel;