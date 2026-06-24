"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { getAdminLetters } from "@/services/client/admin-letter-client-service";
import { AdminLetterListItem } from "@/types/response/admin/letter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const STATUS_FILTERS = ["All", "Diajukan", "Diproses", "Siap Diambil", "Selesai", "Ditolak"] as const;
type FilterStatus = typeof STATUS_FILTERS[number];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Diajukan": return "secondary";
    case "Diproses": return "outline";
    case "Siap Diambil": return "default";
    case "Selesai": return "default";
    case "Ditolak": return "destructive";
    default: return "default";
  }
};

export function AdminLetterList() {
  const [page, setPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("Diajukan");
  const { data: responseData, error, isLoading } = useSWR(
    ["/api/admin/letters", page, selectedStatus],
    ([, pageArg, statusArg]) => getAdminLetters(pageArg as number, statusArg as string),
    {
      keepPreviousData: true,
      refreshInterval: 5000,
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const list: AdminLetterListItem[] = responseData?.list || [];
  const meta = responseData?.meta || { currentPage: 1, totalPages: 1, totalItems: 0 };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between bg-muted/30 p-2.5 rounded-lg border border-border/50">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold uppercase text-muted-foreground mr-1">Antrean:</span>
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => { setSelectedStatus(st); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === st
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {st === "All" ? "Semua" : st}
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground font-medium px-1 mt-2 sm:mt-0">
          Total Dokumen: <strong className="text-foreground font-mono">{meta.totalItems}</strong>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold border-b border-border/50">
                <tr>
                  <th className="px-6 py-4">No. Resi & Tgl</th>
                  <th className="px-6 py-4">Pemohon</th>
                  <th className="px-6 py-4">Unit Tujuan</th>
                  <th className="px-6 py-4">Jenis Surat</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading && list.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-32 text-center text-muted-foreground text-sm font-medium">
                      Memuat antrean dokumen...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="h-32 text-center text-destructive font-bold text-sm">
                      Gagal terhubung ke database.
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-32 text-center text-muted-foreground text-sm font-medium">
                      Tidak ada surat pada kategori status {selectedStatus}
                    </td>
                  </tr>
                ) : (
                  list.map((item) => (
                    <tr key={item._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-primary">{item.letterNumber}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold">{item.mahasiswaName}</span>
                          <span className="text-xs text-muted-foreground font-mono">{item.mahasiswaNim}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold">{item.targetUnit}</td>
                      <td className="px-6 py-4">{item.type}</td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toast.info(`Aksi untuk ${item.letterNumber} di sini`)}
                          className="text-xs font-black text-primary hover:underline cursor-pointer"
                        >
                          Proses
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {meta.totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm font-medium px-4 text-muted-foreground">
                Halaman {meta.currentPage} dari {meta.totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); if (page < meta.totalPages) setPage(page + 1); }}
                className={page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}