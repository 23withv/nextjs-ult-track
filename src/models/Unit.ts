import mongoose, { Schema, Model } from "mongoose";
import { IUnit } from "@/types/models";

const UnitSchema = new Schema<IUnit>({
  name: { type: String, required: true, unique: true, trim: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const UnitModel: Model<IUnit> = mongoose.models.Unit || mongoose.model<IUnit>("Unit", UnitSchema);
export default UnitModel;