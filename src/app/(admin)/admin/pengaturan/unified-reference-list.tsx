"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ClientPagination } from "@/components/shared/client-pagination";
import { ReferenceItem, ReferenceResponse } from "@/types/response/admin/reference";

export function UnifiedReferenceList() {
  const { mutate } = useSWRConfig();
  const [activeFilter, setActiveFilter] = useState<"unit" | "letterType">("unit");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"unit" | "letterType" | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetcher = (url: string) => axios.get<ReferenceResponse>(url).then((res) => res.data.data);
  const { data, isLoading } = useSWR(`/api/admin/references/${activeFilter}`, fetcher);

  const itemsPerPage = 10;
  const list = data || [];
  const totalPages = Math.ceil(list.length / itemsPerPage) || 1;
  const currentData = list.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAdd = async () => {
    if (!name.trim() || !dialogType) return;
    setIsSubmitting(true);

    const label = dialogType === "unit" ? "Unit Tujuan" : "Jenis Surat";
    const toastId = toast.loading(`Menambahkan ${label}...`);
    try {
      await axios.post(`/api/admin/references/${dialogType}`, { name });
      setName("");
      setOpen(false);
      // Picu revalidasi cache SWR untuk memperbarui tabel data
      mutate(`/api/admin/references/${dialogType}`);
      toast.success(`${label} berhasil ditambahkan.`, { id: toastId });
    } catch (error) {
      // Tangkap dan terjemahkan AxiosError untuk dikembalikan ke UI
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(errorMessage || "Gagal menyimpan data. Pastikan nama unik.", { id: toastId });
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const toastId = toast.loading(`Menghapus ${name}...`);
    try {
      await axios.delete(`/api/admin/references/${activeFilter}`, { data: { id } });
      // Picu revalidasi cache SWR untuk memperbarui tabel data
      mutate(`/api/admin/references/${activeFilter}`);
      if (currentData.length === 1 && page > 1) {
        setPage(page - 1);
      }
      toast.success(`${name} berhasil dihapus.`, { id: toastId });
    } catch (error) {
      // Tangkap dan terjemahkan AxiosError untuk dikembalikan ke UI
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(errorMessage || "Gagal menghapus data.", { id: toastId });
    }
  };

  const openAddDialog = (type: "unit" | "letterType") => {
    setDialogType(type);
    setName("");
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Pengaturan Referensi</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Kelola master data sistem.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={() => openAddDialog("unit")} className="font-bold cursor-pointer flex-1 md:flex-none">
            + Tambah Unit Tujuan
          </Button>
          <Button onClick={() => openAddDialog("letterType")} className="font-bold cursor-pointer flex-1 md:flex-none" variant="outline">
            + Tambah Jenis Surat
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah {dialogType === "unit" ? "Unit Tujuan" : "Jenis Surat"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder={`Contoh: ${dialogType === "unit" ? "Akademik" : "Surat Izin"}`}
              disabled={isSubmitting}
            />
            <Button onClick={handleAdd} className="w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Simpan Data"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-3 rounded-lg border border-border/50">
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setActiveFilter("unit"); setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeFilter === "unit" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
          >
            Unit Kampus
          </button>
          <button
            onClick={() => { setActiveFilter("letterType"); setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeFilter === "letterType" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
          >
            Jenis Surat
          </button>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">No</th>
                  <th className="px-6 py-4">Nama {activeFilter === "unit" ? "Unit Tujuan" : "Jenis Surat"}</th>
                  <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="h-32 text-center text-muted-foreground text-sm font-medium">Memuat data...</td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((item: ReferenceItem, index: number) => (
                    <tr key={item._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-center text-muted-foreground font-medium">{(page - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                              <AlertDialogDescription>Data {item.name} akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90 cursor-pointer" onClick={() => handleDelete(item._id, item.name)}>Ya, Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="h-32 text-center text-muted-foreground text-sm font-medium italic">Belum ada data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ClientPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
