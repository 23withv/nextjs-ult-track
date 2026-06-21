"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMahasiswaList } from "@/services/client/mahasiswa-client-service";
import { MahasiswaListItem } from "@/types/response/mahasiswa";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MahasiswaList() {
  const [data, setData] = useState<MahasiswaListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMahasiswaList();
        setData(result.data);
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="text-sm font-medium text-muted-foreground">Memuat data...</span>
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
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold border-b border-border/50">
              <tr>
                <th className="px-6 py-4">NIM</th>
                <th className="px-6 py-4">Nama Lengkap</th>
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
  );
}