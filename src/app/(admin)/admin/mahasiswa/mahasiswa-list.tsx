"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { getMahasiswaList } from "@/services/client/mahasiswa-client-service";
import { MahasiswaListItem } from "@/types/response/mahasiswa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function MahasiswaList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: responseData, error, isLoading } = useSWR(
    ["/api/admin/mahasiswa", currentPage], 
    ([, pageArg]) => getMahasiswaList(pageArg),
    {
      keepPreviousData: true,
      onError: (err: Error) => {
        toast.error(err.message);
      },
    }
  );

  const data: MahasiswaListItem[] = responseData?.data || [];
  const meta = responseData?.meta || { currentPage: 1, totalPages: 1, totalItems: 0 };

  if (isLoading && data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="text-sm font-medium text-muted-foreground">Memuat data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 border border-destructive/20 bg-destructive/10 rounded-lg">
        <span className="text-sm font-medium text-destructive">Gagal memuat daftar mahasiswa.</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 border border-dashed border-border rounded-lg">
        <span className="text-sm font-medium text-muted-foreground">Belum ada data mahasiswa terdaftar.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                }}
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
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < meta.totalPages) setCurrentPage((prev) => prev + 1);
                }}
                className={currentPage === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}