import { Document, Types } from "mongoose";

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

export interface ILetter extends Document {
  mahasiswaId: Types.ObjectId | IMahasiswa;
  type: "Surat Keterangan Aktif" | "Surat Pengantar Magang" | "Surat Pengajuan Cuti" | "Lainnya";
  customTypeDetail?: string | null;
  letterNumber?: string | null;
  purpose: string;
  status: "Diajukan" | "Diproses" | "Siap Diambil" | "Selesai" | "Ditolak";
  verificationCode: string;
  documentUrl?: string | null;
  adminNotes?: string | null;
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