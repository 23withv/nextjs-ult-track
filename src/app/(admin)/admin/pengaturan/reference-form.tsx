"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { toast } from "sonner";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReferenceItem, ReferenceResponse } from "@/types/response/admin/reference";

interface Props {
  type: "unit" | "letterType";
  label: string;
}

export function ReferenceList({ type, label }: Props) {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetcher = (url: string) => axios.get<ReferenceResponse>(url).then((res) => res.data.data);
  const { data, isLoading } = useSWR(`/api/admin/references/${type}`, fetcher);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);

    const promise = axios.post(`/api/admin/references/${type}`, { name });

    toast.promise(promise, {
      loading: `Menambahkan ${label}...`,
      success: () => {
        setName("");
        setOpen(false);
        mutate(`/api/admin/references/${type}`);
        return `${label} berhasil ditambahkan.`;
      },
      error: "Gagal menyimpan data. Pastikan nama unik.",
    });

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const promise = axios.delete(`/api/admin/references/${type}`, { data: { id } });

    toast.promise(promise, {
      loading: `Menghapus ${name}...`,
      success: () => {
        mutate(`/api/admin/references/${type}`);
        return `${name} berhasil dihapus.`;
      },
      error: "Gagal menghapus data.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{label}</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Tambah {label}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tambah {label}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder={`Contoh: ${label === "Unit Tujuan" ? "Akademik" : "Surat Izin"}`}
                disabled={isSubmitting}
              />
              <Button onClick={handleAdd} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Simpan Data"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td className="p-6 text-center text-muted-foreground">Memuat data...</td></tr>
              ) : data && data.length > 0 ? (
                data.map((item: ReferenceItem) => (
                  <tr key={item._id} className="hover:bg-muted/50">
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
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(item._id, item.name)}>Ya, Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td className="p-6 text-center text-muted-foreground italic">Belum ada data {label.toLowerCase()}.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}