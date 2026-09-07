import mongoose, { Schema, Model } from "mongoose";
import { IAdmin } from "@/types/models";

const AdminSchema = new Schema<IAdmin>(
  {
    nip: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    loket: { type: String, default: "ULT Pusat", trim: true },
  },
  { timestamps: true },
);

const AdminModel: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default AdminModel;