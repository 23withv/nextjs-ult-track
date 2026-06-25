export interface AdminLetterListItem {
  _id: string;
  letterNumber: string;
  mahasiswaNim: string;
  mahasiswaName: string;
  targetUnit: string;
  type: string;
  mahasiswaNote?: string;
  status: "Diajukan" | "Diproses" | "Siap Diambil" | "Selesai" | "Ditolak";
  createdAt: string;
  delegateInfo?: { nim: string; name: string } | null;
}

export interface AdminLetterListResponse {
  list: AdminLetterListItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}