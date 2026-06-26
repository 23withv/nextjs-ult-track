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
  Calendar, 
  Filter,
  LucideIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  if (!data && !isLoading) return <div className="text-center p-10 font-bold text-destructive">Gagal memuat dasbor.</div>;

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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold">Periode Laporan:</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={currentYear} onValueChange={(v) => handleUpdateFilter("year", v)}>
            <SelectTrigger className="w-full sm:w-32 h-10 font-bold bg-background">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {availableYears?.map((y: number) => (
                <SelectItem key={y} value={String(y)} className="font-bold">Tahun {y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentMonth} onValueChange={(v) => handleUpdateFilter("month", v)}>
            <SelectTrigger className="w-full sm:w-48 h-10 font-bold bg-background">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Pilih Bulan" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {monthsList.map((m) => (
                <SelectItem key={m.v} value={m.v} className="font-bold">{m.l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pengajuan" value={stats.totalLetter} icon={FileText} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard title="Total Mahasiswa" value={stats.totalMahasiswa} icon={Users} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/20" />
        <StatCard title="Unit Tersedia" value={stats.totalUnit} icon={Building2} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
        <StatCard title="Jenis Surat" value={stats.totalLetterType} icon={Layers} color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-tight flex items-center justify-between">
              <span>Tren Pengajuan Surat</span>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {isMonthView ? `Harian (${monthsList.find(m => m.v === currentMonth)?.l})` : "Bulanan (1 Tahun)"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-87.5">
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

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-tight">Sebaran Unit Tujuan</CardTitle>
          </CardHeader>
          <CardContent className="h-87.5 flex items-center justify-center">
            {pieChart.length === 0 ? (
               <p className="text-sm text-muted-foreground italic">Belum ada data pada periode ini.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChart} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
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
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <div className="w-2 h-4 bg-primary rounded-full"></div>
          Pengajuan Terbaru (Periode Ini)
        </h3>
        
        {latestLetters.length === 0 ? (
          <div className="p-10 border border-dashed rounded-xl text-center text-muted-foreground text-sm bg-muted/20">
            Belum ada pengajuan surat pada periode yang dipilih.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {latestLetters.map((l: ILatestLetter) => (
              <div key={l._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-card border border-border/50 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{l.mahasiswaName} <span className="text-muted-foreground font-mono font-normal">({l.mahasiswaNim})</span></h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{l.type} • {l.targetUnit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium bg-muted/50 px-3 py-2 rounded-lg">
                  <span className="flex items-center gap-1.5"><MapPin size={12}/> {l.letterNumber}</span>
                  <Badge variant="outline" className="bg-background flex items-center gap-1.5 px-2 py-0.5">
                    {getStatusIcon(l.status)} {l.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: number, icon: LucideIcon, color: string, bg: string }) {
  return (
    <Card className="shadow-sm border-border/50 hover:scale-[1.02] transition-transform">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", bg, color)}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black mt-1">{value.toLocaleString("id-ID")}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-100 w-full rounded-xl" />
        <Skeleton className="h-100 w-full rounded-xl" />
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  );
}