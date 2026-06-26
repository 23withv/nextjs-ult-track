"use client";

import useSWR from "swr";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { 
  Users, 
  FileText, 
  Building2, 
  Layers, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Info, 
  LucideIcon 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { cn } from "@/lib/utils";
import { IAdminDashboardRes, ILatestLetter, IPieChartData } from "@/types/response/admin/admin-dash";

const LINE_COLORS = {
  Diajukan: "#f59e0b",
  Diproses: "#fbbf24",
  "Siap Diambil": "#3b82f6",
  Selesai: "#10b981",
  Ditolak: "#ef4444"
};
const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#64748b"];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Selesai": return <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
    case "Ditolak": return <XCircle className="w-3 h-3 text-destructive" />;
    case "Siap Diambil": return <Info className="w-3 h-3 text-blue-600" />;
    default: return <Clock className="w-3 h-3 text-muted-foreground" />;
  }
};

export function AdminDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentYear = searchParams.get("year") || String(new Date().getFullYear());
  const currentMonth = searchParams.get("month") || "all";

  const apiUrl = `/api/admin/dashboard?year=${currentYear}&month=${currentMonth}`;

  // Panggil SWR hooks untuk mengeksekusi pengambilan data analitik dashboard dari client-service
  const { data, isLoading } = useSWR<IAdminDashboardRes>(
    apiUrl,
    (url) => axios.get(url).then(res => res.data.data),
    { keepPreviousData: true }
  );

  const handleUpdateFilter = (type: "year" | "month", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    if (type === "year") params.set("month", "all");

    startTransition(() => {
      router.push(`/admin/dashboard?${params.toString()}`);
    });
  };

  if (isLoading && !data) return <DashboardSkeleton />;
  if (!data && !isLoading) return <div className="flex justify-center items-center p-8 border border-destructive/20 bg-destructive/10 rounded-lg"><span className="text-sm font-medium text-destructive">Gagal memuat dasbor.</span></div>;

  const { stats, lineChart, pieChart, latestLetters, availableYears, isMonthView } = data!;

  const monthsList = [
    { v: "all", l: "Sepanjang Tahun" },
    { v: "1", l: "Januari" }, { v: "2", l: "Februari" }, { v: "3", l: "Maret" },
    { v: "4", l: "April" }, { v: "5", l: "Mei" }, { v: "6", l: "Juni" },
    { v: "7", l: "Juli" }, { v: "8", l: "Agustus" }, { v: "9", l: "September" },
    { v: "10", l: "Oktober" }, { v: "11", l: "November" }, { v: "12", l: "Desember" },
  ];

  return (
    <div className={cn("space-y-6 transition-opacity duration-200", isPending && "opacity-60")}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-muted/30 p-3 rounded-lg border border-border/50 items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground">Tahun Laporan</label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={currentYear}
            onChange={(e) => handleUpdateFilter("year", e.target.value)}
          >
            {availableYears?.map((y: number) => (
              <option key={y} value={String(y)}>Tahun {y}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground">Bulan</label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            value={currentMonth}
            onChange={(e) => handleUpdateFilter("month", e.target.value)}
          >
            {monthsList.map((m) => (
              <option key={m.v} value={m.v}>{m.l}</option>
            ))}
          </select>
        </div>
        <div className="hidden md:block"></div> 
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Pengajuan" value={stats.totalLetter} icon={FileText} colorClass="text-blue-600" bgClass="bg-blue-500/10" />
        <StatCard title="Total Mahasiswa" value={stats.totalMahasiswa} icon={Users} colorClass="text-emerald-600" bgClass="bg-emerald-500/10" />
        <StatCard title="Unit Tersedia" value={stats.totalUnit} icon={Building2} colorClass="text-amber-600" bgClass="bg-amber-500/10" />
        <StatCard title="Jenis Surat" value={stats.totalLetterType} icon={Layers} colorClass="text-purple-600" bgClass="bg-purple-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base tracking-tight flex items-center justify-between">
              <span>Tren Pengajuan Surat</span>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {isMonthView ? `Harian (${monthsList.find(m => m.v === currentMonth)?.l})` : "Bulanan (1 Tahun)"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                {Object.keys(LINE_COLORS).map(status => (
                  <Line 
                    key={status} type="monotone" dataKey={status} 
                    stroke={LINE_COLORS[status as keyof typeof LINE_COLORS]} 
                    strokeWidth={3} dot={{ r: isMonthView ? 0 : 3 }} activeDot={{ r: 6 }} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base tracking-tight">Sebaran Unit Tujuan</CardTitle>
          </CardHeader>
          <CardContent className="h-75 flex items-center justify-center">
            {pieChart.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Belum ada data pada periode ini.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChart} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {pieChart.map((entry: IPieChartData, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
          Pengajuan Terbaru (Periode Ini)
        </h3>
        
        {latestLetters.length === 0 ? (
          <div className="flex justify-center items-center p-8 border border-dashed border-border rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Belum ada pengajuan surat pada periode yang dipilih.</span>
          </div>
        ) : (
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold border-b border-border/50">
                    <tr>
                      <th className="px-6 py-4">Pemohon</th>
                      <th className="px-6 py-4">Nomor Resi</th>
                      <th className="px-6 py-4">Tujuan & Jenis Surat</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {latestLetters.map((l: ILatestLetter) => (
                      <tr key={l._id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold">{l.mahasiswaName}</span>
                            <span className="text-xs text-muted-foreground">{l.mahasiswaNim}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium flex items-center gap-1.5 mt-1"><MapPin size={14} className="text-muted-foreground"/> {l.letterNumber}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold">{l.targetUnit}</span>
                            <span className="text-xs text-muted-foreground">{l.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-background">
                            <span className="flex items-center gap-1.5">{getStatusIcon(l.status)} {l.status}</span>
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, colorClass, bgClass }: { title: string, value: number, icon: LucideIcon, colorClass: string, bgClass: string }) {
  return (
    <Card className="shadow-sm border-border/50 bg-card">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn("p-3 rounded-lg", bgClass, colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <h4 className="text-xl font-black">{value.toLocaleString("id-ID")}</h4>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="md:col-span-2 h-87.5 w-full" />
        <Skeleton className="h-87.5 w-full" />
      </div>
      <Skeleton className="h-75 w-full" />
    </div>
  );
}