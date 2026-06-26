"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import axios from "axios";
import { AdminLetterListItem } from "@/types/response/admin/letter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  letter: AdminLetterListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS = ["Diajukan", "Diproses", "Siap Diambil", "Selesai", "Ditolak"];

export function AdminProcessDialog({ letter, isOpen, onClose }: Props) {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  if (letter && status === "" && isOpen) {
    setStatus(letter.status);
  }

  const handleClose = () => {
    setStatus("");
    setAdminNotes("");
    setRejectionReason("");
    onClose();
  };

  const handleSave = async () => {
    if (!letter) return;

    if (status === "Ditolak" && !rejectionReason.trim()) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      // Eksekusi fungsi mutasi API Client untuk menyimpan perubahan status surat
      await axios.patch(`/api/admin/letters/${letter._id}`, {
        status,
        adminNotes,
        rejectionReason: status === "Ditolak" ? rejectionReason : null,
      });

      toast.success("Status surat berhasil diperbarui");
      // Picu revalidasi cache SWR untuk memperbarui tabel data
      mutate((key) => Array.isArray(key) && key[0] === "/api/admin/letters");
      handleClose();
    } catch {
      toast.error("Gagal memperbarui status surat");
    } finally {
      setIsLoading(false);
    }
  };

  if (!letter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Proses Surat</DialogTitle>
          <DialogDescription>
            Perbarui status untuk resi <strong className="text-primary">{letter.letterNumber}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-muted p-3 rounded-md text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pemohon:</span>
              <span className="font-bold">{letter.mahasiswaName} ({letter.mahasiswaNim})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tujuan:</span>
              <span className="font-medium">{letter.targetUnit}</span>
            </div>
            <div className="flex justify-between border-b pb-1 mb-1">
              <span className="text-muted-foreground">Jenis:</span>
              <span className="font-medium text-right">{letter.type}</span>
            </div>
            {letter.mahasiswaNote && letter.mahasiswaNote !== "-" && (
              <div className="pt-1">
                <span className="text-muted-foreground block text-xs">Catatan Mahasiswa:</span>
                <span className="italic">{letter.mahasiswaNote}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Ubah Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {status === "Ditolak" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label className="font-bold text-destructive">Alasan Penolakan</Label>
              <Input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Wajib diisi..."
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-bold">Catatan Admin (Opsional)</Label>
            <Input
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Catatan internal atau info untuk mahasiswa..."
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>Batal</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}