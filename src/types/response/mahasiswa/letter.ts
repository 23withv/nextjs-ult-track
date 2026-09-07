export interface LetterListItem {
  _id: string;
  letterNumber?: string;
  targetUnit: string;
  type: string;
  status: string;
  createdAt: string;
  mahasiswaNote?: string;
  documentUrl?: string;
  adminNotes?: string;
  rejectionReason?: string;
  delegateInfo?: { nim: string; name: string } | null;
}

export interface DelegatedLetterItem {
  _id: string;
  letterNumber: string;
  pemohonName: string;
  pemohonNim: string;
  targetUnit: string;
  type: string;
  status: string;
  createdAt: string;
}