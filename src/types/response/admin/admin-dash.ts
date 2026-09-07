export interface IAdminDashStats {
  totalUnit: number;
  totalLetterType: number;
  totalLetter: number;
  totalMahasiswa: number;
}

export interface ILineChartData {
  name: string;
  Diajukan: number;
  Diproses: number;
  "Siap Diambil": number;
  Selesai: number;
  Ditolak: number;
}

export interface IPieChartData {
  name: string;
  value: number;
}

export interface ILatestLetter {
  _id: string;
  letterNumber: string;
  mahasiswaName: string;
  mahasiswaNim: string;
  targetUnit: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface IAdminDashboardRes {
  stats: IAdminDashStats;
  lineChart: ILineChartData[];
  pieChart: IPieChartData[];
  latestLetters: ILatestLetter[];
  availableYears: number[];
  isMonthView: boolean;
}