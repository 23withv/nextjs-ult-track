export interface AdminLetterListItem {
  _id: string;
  letterNumber: string;
  mahasiswaNim: string;
  mahasiswaName: string;
  targetUnit: string;
  type: string;
  status: "Diajukan" | "Diproses" | "Siap Diambil" | "Selesai" | "Ditolak";
  createdAt: string;
}

export interface AdminLetterListResponse {
  list: AdminLetterListItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}