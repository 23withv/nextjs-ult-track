"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import axios from "axios";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleClose = () => {
    setTakenByOption("pemohon_langsung");
    handleClearFile();
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
      // Eksekusi fungsi mutasi API Client untuk mengirimkan payload serah terima dokumen
      await axios.post(`/api/admin/letters/${letter._id}/handover`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Dokumen berhasil diserahkan");
      // Picu revalidasi cache SWR untuk memperbarui tabel data
      mutate((key) => Array.isArray(key) && key[0] === "/api/admin/letters");
      handleClose();
    } catch {
      // Tangkap dan terjemahkan error mentah untuk dikembalikan ke UI
      toast.error("Gagal memproses penyerahan dokumen");
    } finally {
      setIsLoading(false);
    }
  };

  if (!letter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
            
            {previewUrl ? (
              <div className="relative w-full rounded-md border border-border/50 overflow-hidden bg-muted/30">
                <div className="relative aspect-video w-full">
                  <Image 
                    src={previewUrl} 
                    alt="Preview Bukti Pengambilan" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <div className="flex justify-between items-center p-2 bg-background border-t border-border/50">
                  <span className="text-xs truncate max-w-[200px] text-muted-foreground font-medium">
                    {file?.name}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7 px-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      Ganti
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="text-xs h-7 px-2"
                      onClick={handleClearFile}
                      disabled={isLoading}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-border/50 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Klik untuk mengunggah foto</p>
                <p className="text-xs text-muted-foreground">Maksimal 10MB. Format JPG/PNG.</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </div>
            )}
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