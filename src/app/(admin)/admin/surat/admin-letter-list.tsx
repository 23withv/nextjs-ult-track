"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { FileText, Clock, CheckCircle2, Inbox } from "lucide-react";
import {
  getAdminLetters,
  getAdminLetterStats,
} from "@/services/client/admin-letter-client-service";
import { AdminLetterListItem } from "@/types/response/admin/letter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AdminProcessDialog } from "./admin-process-letter";
import { AdminHandoverDialog } from "./admin-handover-dialog";
import { AdminSuratAction } from "./admin-surat-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_FILTERS = [
  "All",
  "Diajukan",
  "Diproses",
  "Siap Diambil",
  "Selesai",
  "Ditolak",
] as const;
type FilterStatus = (typeof STATUS_FILTERS)[number];

const getStatusBadgeVariant = (status: string) => {
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

export function AdminLetterList() {
  const [page, setPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] =
    useState<FilterStatus>("All");

  const [selectedLetter, setSelectedLetter] =
    useState<AdminLetterListItem | null>(null);
  const [selectedHandoverLetter, setSelectedHandoverLetter] =
    useState<AdminLetterListItem | null>(null);

  const [resi, setResi] = useState("");
  const [appliedResi, setAppliedResi] = useState("");

  // Panggil SWR hooks untuk mengambil daftar surat admin dengan parameter filter
  const {
    data: responseData,
    error: listError,
    isLoading: listLoading,
  } = useSWR(
    ["/api/admin/letters", page, selectedStatus, appliedResi], 
    ([, pageArg, statusArg, resiArg]) =>
      getAdminLetters(pageArg as number, statusArg as string, resiArg as string),
    {
      keepPreviousData: true,
      refreshInterval: 5000,
      onError: (err: Error) => toast.error(err.message),
    },
  );

  // Panggil SWR hooks untuk mengambil agregasi statistik persuratan admin
  const { data: stats, isLoading: statsLoading } = useSWR(
    "/api/admin/letters/stats",
    getAdminLetterStats,
    { refreshInterval: 10000 },
  );

  const list: AdminLetterListItem[] = responseData?.list || [];
  const meta = responseData?.meta || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  return (
    <div className="space-y-6 mt-6">
      <AdminProcessDialog
        letter={selectedLetter}
        isOpen={!!selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />
      <AdminHandoverDialog
        letter={selectedHandoverLetter}
        isOpen={!!selectedHandoverLetter}
        onClose={() => setSelectedHandoverLetter(null)}
      />
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-sm border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Dokumen
                </p>
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
                <p className="text-xs text-muted-foreground font-medium">
                  Perlu Diproses
                </p>
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
                <p className="text-xs text-muted-foreground font-medium">
                  Siap Diambil
                </p>
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
                <p className="text-xs text-muted-foreground font-medium">
                  Selesai/Riwayat
                </p>
                <h4 className="text-xl font-black">{stats.riwayat}</h4>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-3 rounded-lg border border-border/50">
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => {
                setSelectedStatus(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${selectedStatus === st ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
            >
              {st === "All" ? "Semua" : st}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Cari No. Resi..."
            className="w-48"
            value={resi}
            onChange={(e) => setResi(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setAppliedResi(resi)}
          />
          <Button onClick={() => setAppliedResi(resi)} className="cursor-pointer">Cari</Button>
          {appliedResi && (
            <Button
              variant="outline"
              onClick={() => {
                setResi("");
                setAppliedResi("");
              }}
            >
              Reset
            </Button>
          )}
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
                {listLoading && list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground text-sm font-medium"
                    >
                      Memuat antrean dokumen...
                    </td>
                  </tr>
                ) : listError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-32 text-center text-destructive font-bold text-sm"
                    >
                      Gagal terhubung ke database.
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground text-sm font-medium"
                    >
                      Tidak ada surat pada kategori status {selectedStatus}
                    </td>
                  </tr>
                ) : (
                  list.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-primary">
                            {item.letterNumber}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold">
                            {item.mahasiswaName}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {item.mahasiswaNim}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold">{item.targetUnit}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.type}</span>
                          {item.mahasiswaNote && item.mahasiswaNote !== "-" && (
                            <span className="text-xs text-muted-foreground mt-1 italic">
                              {item.mahasiswaNote}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        <AdminSuratAction
                          item={item}
                          onProcess={(selected) => setSelectedLetter(selected)}
                          onHandover={(selected) =>
                            setSelectedHandoverLetter(selected)
                          }
                          onDetail={(selected) => {
                            toast.info(
                              `Menampilkan detail resi: ${selected.letterNumber}`,
                            );
                          }}
                        />
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
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
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
                onClick={(e) => {
                  e.preventDefault();
                  if (page < meta.totalPages) setPage(page + 1);
                }}
                className={
                  page === meta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
