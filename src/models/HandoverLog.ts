import mongoose, { Schema, Model } from "mongoose";
import { IHandoverLog } from "@/types/models";

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
    actualReceiverName: { type: String, required: true, trim: true },
    evidenceUrl: { type: String, required: true },
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