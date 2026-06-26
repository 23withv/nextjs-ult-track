"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { createLetterSchema, CreateLetterInput } from "@/lib/schemas/letter-schema";
import { postCreateLetter } from "@/services/client/letter-client-service";
import { ReferenceItem } from "@/types/response/admin/reference";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";

export function CreateLetterForm() {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

  // Panggil SWR hooks untuk mengambil referensi unit tujuan surat dari client-service
  const { data: units } = useSWR<ReferenceItem[]>("/api/admin/references/unit", fetcher);
  // Panggil SWR hooks untuk mengambil referensi jenis surat dari client-service
  const { data: letterTypes } = useSWR<ReferenceItem[]>("/api/admin/references/letterType", fetcher);

  const form = useForm<CreateLetterInput>({
    resolver: zodResolver(createLetterSchema as never),
    defaultValues: { 
      customTargetUnitDetail: "", 
      customTypeDetail: "", 
    },
  });

  const selectedTargetUnit = useWatch({ control: form.control, name: "targetUnit" });
  const selectedType = useWatch({ control: form.control, name: "type" });

  const onSubmit = async (values: CreateLetterInput) => {
    try {
      setIsLoading(true);
      // Eksekusi fungsi mutasi API Client untuk mengirimkan payload pengajuan surat
      const result = await postCreateLetter(values);
      toast.success(result.message);
      form.reset();
      setOpen(false);
      mutate("/api/mahasiswa/letters");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => { if (!newOpen) form.reset(); setOpen(newOpen); }}>
      <DialogTrigger asChild>
        <Button className="font-bold cursor-pointer">+ Ajukan Surat Baru</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Formulir Pengajuan Surat</DialogTitle>
          <DialogDescription>Pastikan tujuan dan jenis surat sudah benar sebelum dikirimkan.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold">Unit Tujuan</Label>
            <select {...form.register("targetUnit")} disabled={isLoading} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Pilih Unit Tujuan</option>
              {units?.map((unit) => (
                <option key={unit._id} value={unit.name}>{unit.name}</option>
              ))}
              <option value="Lainnya">Lainnya</option>
            </select>
            {form.formState.errors.targetUnit && <p className="text-xs text-destructive">{form.formState.errors.targetUnit.message}</p>}
          </div>

          {selectedTargetUnit === "Lainnya" && (
            <div className="space-y-2">
              <Label className="text-sm font-bold">Detail Unit Tujuan</Label>
              <Input {...form.register("customTargetUnitDetail")} disabled={isLoading} className="h-10" placeholder="Sebutkan unit tujuan..." />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-bold">Jenis Surat</Label>
            <select {...form.register("type")} disabled={isLoading} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Pilih Jenis Surat</option>
              {letterTypes?.map((type) => (
                <option key={type._id} value={type.name}>{type.name}</option>
              ))}
              <option value="Lainnya">Lainnya</option>
            </select>
            {form.formState.errors.type && <p className="text-xs text-destructive">{form.formState.errors.type.message}</p>}
          </div>

          {selectedType === "Lainnya" && (
            <div className="space-y-2">
              <Label className="text-sm font-bold">Detail Jenis Surat</Label>
              <Input {...form.register("customTypeDetail")} disabled={isLoading} className="h-10" placeholder="Sebutkan jenis surat..." />
            </div>
          )}
          
          <div className="space-y-2">
            <Label className="text-sm font-bold">Catatan Tambahan (Opsional)</Label>
            <Input 
              {...form.register("mahasiswaNote")} 
              disabled={isLoading} 
              className="h-10" 
              placeholder="Misal: Keperluan Lomba Debat Nasional / UKM Robotika" 
            />
          </div>

          <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-md">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <span className="font-bold">Informasi:</span> Pengajuan surat memerlukan waktu proses sekitar 2-3 hari kerja. Mohon periksa status pengajuan Anda secara berkala.
            </p>
          </div>

          <Button type="submit" className="w-full h-11 font-bold mt-4 cursor-pointer" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Ajukan Surat"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}