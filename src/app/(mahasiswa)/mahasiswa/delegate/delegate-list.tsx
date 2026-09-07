"use client";

import { useState } from "react";
import useSWR from "swr";
import { FileText, Inbox, CheckCircle2, SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDelegatedLetters } from "@/services/client/letter-client-service";
import { DelegatedLetterItem } from "@/types/response/mahasiswa/letter";

const STATUS_FILTERS = ["All", "Siap Diambil", "Selesai"];

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Diajukan": return "secondary";
    case "Diproses": return "outline";
    case "Siap Diambil": return "default";
    case "Selesai": return "default";
    case "Ditolak": return "destructive";
    default: return "default";
  }
};

export function DelegateListClient() {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Panggil SWR hooks untuk mengambil daftar surat terdelegasi dari client-service
  const { data, error, isLoading } = useSWR(
    "/api/mahasiswa/delegates",
    getDelegatedLetters,
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 border border-destructive/20 bg-destructive/10 rounded-lg mt-6">
        <span className="text-sm font-medium text-destructive">Gagal memuat daftar delegasi.</span>
      </div>
    );
  }

  const letters = data || [];

  const stats = {
    total: letters.length,
    siap: letters.filter(l => l.status === "Siap Diambil").length,
    selesai: letters.filter(l => l.status === "Selesai").length,
  };

  const filteredLetters = letters.filter(
    (letter) => selectedStatus === "All" || letter.status === selectedStatus
  );

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-border/50 bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Tugas</p>
              <h4 className="text-xl font-black">{stats.total}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Siap Diambil</p>
              <h4 className="text-xl font-black">{stats.siap}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Selesai Diambil</p>
              <h4 className="text-xl font-black">{stats.selesai}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <span className="text-xs font-bold uppercase text-muted-foreground mr-1">Filter:</span>
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedStatus === status
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {status === "All" ? "Semua Tugas" : status}
          </button>
        ))}
      </div>

      {letters.length === 0 ? (
        <div className="flex flex-col justify-center items-center p-12 border border-dashed border-border rounded-lg bg-muted/20">
          <FileText className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
          <span className="text-sm font-medium text-muted-foreground">
            Anda belum ditunjuk sebagai delegasi untuk dokumen apa pun.
          </span>
        </div>
      ) : filteredLetters.length === 0 ? (
        <div className="flex flex-col justify-center items-center p-12 border border-dashed border-border rounded-lg bg-muted/20">
          <SearchX className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
          <span className="text-sm font-medium text-muted-foreground">
            Tidak ada dokumen pada kategori status {selectedStatus}
          </span>
        </div>
      ) : (
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-bold border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 w-16 text-center">No</th>
                    <th className="px-6 py-4">Nomor Resi</th>
                    <th className="px-6 py-4">Pemohon Asli</th>
                    <th className="px-6 py-4">Dokumen</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredLetters.map((item: DelegatedLetterItem, index: number) => (
                    <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-center text-muted-foreground font-medium">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-black text-lg text-primary">{item.letterNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold">{item.pemohonName}</span>
                          <span className="text-xs font-mono text-muted-foreground">{item.pemohonNim}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{item.targetUnit}</span>
                          <span className="text-xs text-muted-foreground">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                          {item.status}
                        </Badge>
                        {item.status === "Siap Diambil" && (
                          <p className="text-[10px] text-emerald-600 font-bold mt-1">Bisa diambil sekarang</p>
                        )}
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
  );
}