import { Document, Types } from "mongoose";

// SUB
export interface IMahasiswaInfo {
  _id: Types.ObjectId | string;
  nim: string;
  name: string;
}

// MAIN 
export interface IMahasiswa extends Document {
  nim: string;
  name: string;
  email: string;
  password: string;
  jurusan: string;
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

export interface IUnit extends Document {
  name: string;
  isDeleted: boolean;
  createdAt: Date;
}

export interface ILetterType extends Document {
  name: string;
  isDeleted: boolean;
  createdAt: Date;
}

export interface ILetter extends Document {
  mahasiswaInfo: IMahasiswaInfo;
  targetUnit: string;
  customTargetUnitDetail?: string | null;
  type: string;
  customTypeDetail?: string | null;
  letterNumber?: string | null;
  status: "Diajukan" | "Diproses" | "Siap Diambil" | "Selesai" | "Ditolak";
  documentUrl?: string | null;
  adminNotes?: string | null;
  delegateInfo?: IMahasiswaInfo | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHandoverLog extends Document {
  letterId: Types.ObjectId | ILetter;
  takenByOption: "pemohon_langsung" | "delegasi";
  receiverInfo: IMahasiswaInfo;
  evidenceUrl: string;
  processedBy: Types.ObjectId | IAdmin;
  createdAt: Date;
  updatedAt: Date;
}