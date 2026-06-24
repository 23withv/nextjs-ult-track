"use client";

import useSWR from "swr";
import { getMahasiswaLetters } from "@/services/client/letter-client-service";
import { LetterListItem } from "@/types/response/mahasiswa/letter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Diajukan":
      return "secondary";
    case "Diproses":
      return "outline";
    case "Siap Diambil":
      return "default";
    case "Selesai":
      return "default";
    case "Ditolak":
      return "destructive";
    default:
      return "default";
  }
};

export function MahasiswaLetterList() {
  const { data, error, isLoading } = useSWR("/api/mahasiswa/letters", getMahasiswaLetters);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="text-sm font-medium text-muted-foreground">Memuat data persuratan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 border border-destructive/20 bg-destructive/10 rounded-lg">
        <span className="text-sm font-medium text-destructive">Gagal memuat daftar surat.</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 border border-dashed border-border rounded-lg">
        <span className="text-sm font-medium text-muted-foreground">Belum ada riwayat pengajuan surat.</span>
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
                <th className="px-6 py-4">Tgl Pengajuan</th>
                <th className="px-6 py-4">Unit & Jenis Surat</th>
                <th className="px-6 py-4">Delegasi Pengambil</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.map((letter: LetterListItem) => (
                <tr key={letter._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {new Date(letter.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold">{letter.targetUnit}</span>
                      <span className="text-xs text-muted-foreground">{letter.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {letter.delegateInfo ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-xs">{letter.delegateInfo.name}</span>
                        <span className="text-xs text-muted-foreground">{letter.delegateInfo.nim}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusBadgeVariant(letter.status)}>
                      {letter.status}
                    </Badge>
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