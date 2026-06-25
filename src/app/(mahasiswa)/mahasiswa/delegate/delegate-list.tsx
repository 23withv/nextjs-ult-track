"use client";

import useSWR from "swr";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDelegatedLetters } from "@/services/client/letter-client-service";
import { DelegatedLetterItem } from "@/types/response/mahasiswa/letter";

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
  const { data, error, isLoading } = useSWR(
    "/api/mahasiswa/delegates",
    getDelegatedLetters,
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  if (isLoading) {
    return <div className="space-y-4 mt-6"><Skeleton className="h-20 w-full" /><Skeleton className="h-32 w-full" /></div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 border border-destructive/20 bg-destructive/10 rounded-lg mt-6">
        <span className="text-sm font-medium text-destructive">Gagal memuat daftar delegasi.</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-12 border border-dashed border-border rounded-lg mt-6">
        <FileText className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
        <span className="text-sm font-medium text-muted-foreground">Anda belum ditunjuk sebagai delegasi untuk dokumen apa pun.</span>
      </div>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden mt-6">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold border-b border-border/50">
              <tr>
                <th className="px-6 py-4">Nomor Resi</th>
                <th className="px-6 py-4">Pemohon Asli</th>
                <th className="px-6 py-4">Dokumen</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.map((item: DelegatedLetterItem) => (
                <tr key={item._id} className="hover:bg-muted/50 transition-colors">
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
  );
}