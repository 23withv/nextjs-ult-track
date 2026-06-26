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

export function AdminHandoverDialog({ letter, isOpen, onClose }: Props) {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);

  const [takenByOption, setTakenByOption] = useState<"pemohon_langsung" | "delegasi">("pemohon_langsung");
  const [file, setFile] = useState<File | null>(null);

  const handleClose = () => {
    setTakenByOption("pemohon_langsung");
    setFile(null);
    onClose();
  };

  const handleSave = async () => {
    if (!letter) return;
    let receiverNim = "";
    let receiverName = "";

    if (takenByOption === "pemohon_langsung") {
      receiverNim = letter.mahasiswaNim;
      receiverName = letter.mahasiswaName;
    } else {
      if (!letter.delegateInfo) {
        toast.error("Tidak dapat memproses delegasi. Pemohon belum mendaftarkan delegasi di sistem.");
        return;
      }
      receiverNim = letter.delegateInfo.nim;
      receiverName = letter.delegateInfo.name;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("takenByOption", takenByOption);
    formData.append("receiverNim", receiverNim);
    formData.append("receiverName", receiverName);
    if (file) formData.append("file", file);

    try {
      await axios.post(`/api/admin/letters/${letter._id}/handover`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Dokumen berhasil diserahkan");
      mutate((key) => Array.isArray(key) && key[0] === "/api/admin/letters");
      handleClose();
    } catch {
      toast.error("Gagal memproses penyerahan dokumen");
    } finally {
      setIsLoading(false);
    }
  };

  if (!letter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Penyerahan Dokumen</DialogTitle>
          <DialogDescription>
            Serahkan dokumen fisik <strong className="text-primary">{letter.letterNumber}</strong>. Status akan otomatis menjadi <b>Selesai</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-muted p-3 rounded-md text-sm space-y-2">
            <div>
              <span className="text-muted-foreground block text-xs">Pemohon Asli:</span>
              <span className="font-bold">{letter.mahasiswaName} ({letter.mahasiswaNim})</span>
            </div>
            {letter.delegateInfo ? (
              <div className="pt-2 border-t border-border/50">
                <span className="text-muted-foreground block text-xs font-bold">Delegasi Terdaftar:</span>
                <span className="font-bold">{letter.delegateInfo.name} ({letter.delegateInfo.nim})</span>
              </div>
            ) : (
              <div className="pt-2 border-t border-border/50">
                <span className="text-muted-foreground block text-xs">Delegasi Terdaftar:</span>
                <span className="italic text-muted-foreground">Tidak ada (Hanya bisa diambil pemohon langsung)</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Opsi Pengambilan</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="radio" 
                  checked={takenByOption === "pemohon_langsung"}
                  onChange={() => setTakenByOption("pemohon_langsung")}
                  disabled={isLoading}
                />
                Pemohon Langsung
              </label>
              <label className={`flex items-center gap-2 text-sm ${!letter.delegateInfo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input 
                  type="radio" 
                  checked={takenByOption === "delegasi"}
                  onChange={() => setTakenByOption("delegasi")}
                  disabled={isLoading || !letter.delegateInfo}
                />
                Diwakilkan (Delegasi)
              </label>
            </div>
            {!letter.delegateInfo && takenByOption !== "pemohon_langsung" && (
                <p className="text-xs text-destructive mt-1">Opsi diwakilkan tidak bisa dipilih karena pemohon tidak mendaftarkan delegasi.</p>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-border/50">
            <Label className="font-bold">Foto Bukti Pengambilan (Opsional)</Label>
            <Input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isLoading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">Maksimal 10MB. Format JPG/PNG.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" className="cursor-pointer" onClick={handleClose} disabled={isLoading}>Batal</Button>
          <Button className="cursor-pointer" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Memproses..." : "Selesaikan & Serahkan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}