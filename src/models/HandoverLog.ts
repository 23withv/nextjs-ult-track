import mongoose, { Schema, Model } from "mongoose";
import { IHandoverLog } from "@/types/models";

const MahasiswaInfoSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "Mahasiswa", required: true },
    nim: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const HandoverLogSchema = new Schema<IHandoverLog>(
  {
    letterId: {
      type: Schema.Types.ObjectId,
      ref: "Letter",
      required: true,
      unique: true,
    },
    takenByOption: {
      type: String,
      enum: ["pemohon_langsung", "delegasi"],
      required: true,
    },
    receiverInfo: { type: MahasiswaInfoSchema, required: true },
    evidenceUrl: { type: String, default: null },
    evidencePublicId: { type: String, default: null },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

const HandoverLogModel: Model<IHandoverLog> =
  mongoose.models.HandoverLog ||
  mongoose.model<IHandoverLog>("HandoverLog", HandoverLogSchema);

export default HandoverLogModel;