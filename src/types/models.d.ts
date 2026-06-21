import { Document, Types } from "mongoose";

export interface IMahasiswa extends Document {
  nim: string;
  name: string;
  email: string;
  password: string;
  prodi: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin extends Document {
  nip: string;
  name: string;
  email: string;
  password: string;
  loket: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILetter extends Document {
  mahasiswaId: Types.ObjectId | IMahasiswa;
  type: string;
  purpose: string;
  status: "Diajukan" | "Diproses" | "Siap Diambil" | "Selesai";
  verificationCode: string;
  delegatedTo?: Types.ObjectId | IMahasiswa | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHandoverLog extends Document {
  letterId: Types.ObjectId | ILetter;
  takenByOption: "pemohon_langsung" | "delegasi";
  actualReceiverName: string;
  evidenceUrl: string;
  processedBy: Types.ObjectId | IAdmin;
  createdAt: Date;
  updatedAt: Date;
}