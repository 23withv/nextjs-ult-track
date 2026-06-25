"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Users, UserCheck, UserX, Search } from "lucide-react";
import { getMahasiswaList, getMahasiswaStats } from "@/services/client/mahasiswa-client-service";
import { MahasiswaListItem } from "@/types/response/admin/mahasiswa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PRODI_MAP } from "./register-form";

export function MahasiswaList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputJurusan, setInputJurusan] = useState("");
  const [inputProdi, setInputProdi] = useState("");
  const [appliedJurusan, setAppliedJurusan] = useState("");
  const [appliedProdi, setAppliedProdi] = useState("");

  const { data: stats, isLoading: isStatsLoading } = useSWR(
    ["/api/admin/mahasiswa/stats", appliedJurusan, appliedProdi],
    ([, jur, prod]) => getMahasiswaStats(jur as string, prod as string),
    { refreshInterval: 10000 }
  );

  const {
    data: responseData,
    error,
    isLoading: isListLoading,
  } = useSWR(
    ["/api/admin/mahasiswa", currentPage, appliedJurusan, appliedProdi],
    ([, pageArg, jurArg, prodArg]) => getMahasiswaList(pageArg as number, jurArg as string, prodArg as string),
    {
      keepPreviousData: true,
      onError: (err: Error) => {
        toast.error(err.message);
      },
    }
  );

  const data: MahasiswaListItem[] = responseData?.data || [];
  const meta = responseData?.meta || { currentPage: 1, totalPages: 1, totalItems: 0 };

  const handleApplyFilter = () => {
    setAppliedJurusan(inputJurusan);
    setAppliedProdi(inputProdi);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setInputJurusan("");
    setInputProdi("");
    setAppliedJurusan("");
    setAppliedProdi("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {isStatsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Mahasiswa</p>
                <h4 className="text-xl font-black">{stats.total}</h4>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Akun Aktif</p>
                <h4 className="text-xl font-black">{stats.active}</h4>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Akun Non-Aktif</p>
                <h4 className="text-xl font-black">{stats.inactive}</h4>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-muted/30 p-3 rounded-lg border border-border/50 items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground">Jurusan</label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={inputJurusan}
            onChange={(e) => {
              setInputJurusan(e.target.value);
              setInputProdi("");
            }}
          >
            <option value="">Semua Jurusan</option>
            {Object.keys(PRODI_MAP).map((jur) => (
              <option key={jur} value={jur}>{jur}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground">Program Studi</label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            value={inputProdi}
            disabled={!inputJurusan}
            onChange={(e) => setInputProdi(e.target.value)}
          >
            <option value="">Semua Prodi</option>
            {(PRODI_MAP[inputJurusan] || []).map((prod) => (
              <option key={prod} value={prod}>{prod}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilter} className="flex-1 gap-2">
            <Search className="w-4 h-4" /> Cari
          </Button>
          {(appliedJurusan || appliedProdi) && (
            <Button onClick={handleResetFilter} variant="outline">Reset</Button>
          )}
        </div>
      </div>

      {isListLoading && data.length === 0 ? (
        <div className="flex justify-center items-center p-8">
          <span className="text-sm font-medium text-muted-foreground">Memuat data...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center p-8 border border-destructive/20 bg-destructive/10 rounded-lg">
          <span className="text-sm font-medium text-destructive">Gagal memuat daftar mahasiswa.</span>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center p-8 border border-dashed border-border rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Belum ada data mahasiswa terdaftar / Filter tidak ditemukan.</span>
        </div>
      ) : (
        <>
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold border-b border-border/50">
                    <tr>
                      <th className="px-6 py-4">NIM</th>
                      <th className="px-6 py-4">Nama Lengkap</th>
                      <th className="px-6 py-4">Jurusan</th>
                      <th className="px-6 py-4">Program Studi</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {data.map((mhs) => (
                      <tr key={mhs._id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{mhs.nim}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold">{mhs.name}</span>
                            <span className="text-xs text-muted-foreground">{mhs.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{mhs.jurusan}</td>
                        <td className="px-6 py-4">{mhs.prodi}</td>
                        <td className="px-6 py-4">
                          <Badge variant={mhs.isActive ? "default" : "destructive"}>
                            {mhs.isActive ? "Aktif" : "Non-Aktif"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
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
                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    onClick={(e) => { e.preventDefault(); if (currentPage < meta.totalPages) setCurrentPage(currentPage + 1); }}
                    className={currentPage === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}