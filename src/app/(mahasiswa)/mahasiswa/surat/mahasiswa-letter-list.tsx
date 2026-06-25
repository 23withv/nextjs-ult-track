"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { FileText, Clock, CheckCircle2, Inbox } from "lucide-react";
import { getMahasiswaLetters } from "@/services/client/letter-client-service";
import { LetterListItem } from "@/types/response/mahasiswa/letter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_FILTERS = ["All", "Diajukan", "Diproses", "Siap Diambil", "Selesai", "Ditolak"];

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

export function MahasiswaLetterList() {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const { data, error, isLoading } = useSWR(
    "/api/mahasiswa/letters", 
    getMahasiswaLetters,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
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
      <div className="flex justify-center items-center p-8 border border-destructive/20 bg-destructive/10 rounded-lg mt-6">
        <span className="text-sm font-medium text-destructive">Gagal memuat daftar surat.</span>
      </div>
    );
  }

  const letters = data || [];

  const stats = {
    total: letters.length,
    diproses: letters.filter(l => l.status === "Diajukan" || l.status === "Diproses").length,
    siap: letters.filter(l => l.status === "Siap Diambil").length,
    riwayat: letters.filter(l => l.status === "Selesai" || l.status === "Ditolak").length,
  };

  const filteredLetters = letters.filter(
    (letter) => selectedStatus === "All" || letter.status === selectedStatus
  );

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-border/50 bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Pengajuan</p>
              <h4 className="text-xl font-black">{stats.total}</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50 bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Sedang Diproses</p>
              <h4 className="text-xl font-black">{stats.diproses}</h4>
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
              <p className="text-xs text-muted-foreground font-medium">Riwayat Selesai</p>
              <h4 className="text-xl font-black">{stats.riwayat}</h4>
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
            {status === "All" ? "Semua Surat" : status}
          </button>
        ))}
      </div>

      {filteredLetters.length === 0 ? (
        <div className="flex flex-col justify-center items-center p-12 border border-dashed border-border rounded-lg bg-muted/20">
          <FileText className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
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
                    <th className="px-6 py-4">Tgl Pengajuan</th>
                    <th className="px-6 py-4">Unit & Jenis Surat</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredLetters.map((letter: LetterListItem) => (
                    <tr key={letter._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {new Date(letter.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-62.5 md:max-w-md">
                          <span className="font-bold truncate" title={letter.targetUnit}>{letter.targetUnit}</span>
                          <span className="text-xs text-muted-foreground truncate" title={letter.type}>{letter.type}</span>
                          {letter.mahasiswaNote && letter.mahasiswaNote !== "-" && (
                            <span className="text-xs text-muted-foreground mt-1 italic truncate">
                              {letter.mahasiswaNote}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(letter.status)}>
                          {letter.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link href={`/mahasiswa/surat/${letter._id}`}>
                          <span className="text-xs font-black text-primary hover:underline cursor-pointer px-2 py-1 bg-primary/5 rounded-md hover:bg-primary/10 transition-colors">
                            Lihat Detail
                          </span>
                        </Link>
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