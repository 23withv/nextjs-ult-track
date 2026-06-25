"use client";

import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Info,
  Search,
  UserCheck,
} from "lucide-react";
import { getMahasiswaLetterDetail, patchAssignDelegate, validateDelegateNim } from "@/services/client/letter-client-service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  letterId: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Selesai":
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    case "Ditolak":
      return <XCircle className="w-5 h-5 text-destructive" />;
    case "Siap Diambil":
      return <Info className="w-5 h-5 text-blue-600" />;
    default:
      return <Clock className="w-5 h-5 text-muted-foreground" />;
  }
};

export function DetailSuratClient({ letterId }: Props) {
  const { mutate } = useSWRConfig();
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [searchNim, setSearchNim] = useState("");
  const [foundDelegate, setFoundDelegate] = useState<{
    name: string;
    prodi: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const { data, error, isLoading } = useSWR(
    `/api/mahasiswa/letters/${letterId}`,
    () => getMahasiswaLetterDetail(letterId),
  );

  const handleSearchDelegate = async () => {
    if (!searchNim.trim()) return;
    setIsSearching(true);
    setFoundDelegate(null);
    const result = await validateDelegateNim(searchNim);
    if (result) {
      setFoundDelegate(result);
    } else {
      toast.error("NIM tidak ditemukan dalam sistem");
    }
    setIsSearching(false);
  };

  const handleAssignDelegate = async () => {
    if (!searchNim || !foundDelegate) return;
    setIsAssigning(true);
    try {
      const res = await patchAssignDelegate(letterId, searchNim);
      toast.success(res.message);
      setIsDelegateOpen(false);
      setSearchNim("");
      setFoundDelegate(null);
      mutate(`/api/mahasiswa/letters/${letterId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menunjuk delegasi";
      toast.error(errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-pulse">
        <Skeleton className="w-32 h-10" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-destructive">
          Gagal memuat data
        </h2>
        <p className="text-muted-foreground mt-2">
          {error?.message || "Data tidak ditemukan"}
        </p>
        <Link
          href="/mahasiswa/surat"
          className="mt-4 inline-block text-primary hover:underline font-bold"
        >
          Kembali ke Daftar Surat
        </Link>
      </div>
    );
  }

  const { letter, handover } = data;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Dialog open={isDelegateOpen} onOpenChange={(open) => {
        setIsDelegateOpen(open);
        if (!open) { setSearchNim(""); setFoundDelegate(null); }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Utus Delegasi</DialogTitle>
            <DialogDescription>
              Cari mahasiswa berdasarkan NIM untuk mewakilkan pengambilan dokumen fisik Anda di loket.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input 
                placeholder="Masukkan NIM..." 
                value={searchNim} 
                onChange={(e) => setSearchNim(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchDelegate()}
                disabled={isSearching || isAssigning}
              />
              <Button onClick={handleSearchDelegate} disabled={isSearching || isAssigning || !searchNim}>
                {isSearching ? "Mencari..." : <Search className="w-4 h-4" />}
              </Button>
            </div>
            
            {foundDelegate && (
              <div className="p-3 bg-muted rounded-md border border-border/50 space-y-1 animate-in fade-in">
                <span className="text-xs text-muted-foreground block">Data Mahasiswa:</span>
                <p className="font-bold text-sm">{foundDelegate.name}</p>
                <p className="text-xs text-muted-foreground">{foundDelegate.prodi}</p>
                <Button 
                  className="w-full mt-3" 
                  onClick={handleAssignDelegate}
                  disabled={isAssigning}
                >
                  {isAssigning ? "Memproses..." : "Konfirmasi Utus Delegasi"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <div>
        <Link href="/mahasiswa/surat">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-4 mb-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <FileText className="w-6 h-6" /> Detail Pengajuan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Nomor Resi: <strong className="font-mono text-foreground">{letter.letterNumber || "Belum diterbitkan"}</strong>
            </p>
          </div>
          {letter.status === "Siap Diambil" && (
            <Button onClick={() => setIsDelegateOpen(true)} className="gap-2 font-bold">
              <UserCheck className="w-4 h-4" />
              {letter.delegateInfo ? "Ubah Delegasi" : "Utus Delegasi"}
            </Button>
          )}
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold">{letter.type}</CardTitle>
              <CardDescription className="mt-1 font-medium text-foreground">
                Tujuan: {letter.targetUnit}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 py-1 px-3 bg-background"
            >
              {getStatusIcon(letter.status)}
              <span className="font-bold text-sm">{letter.status}</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs mb-1">
                Tanggal Pengajuan
              </span>
              <p className="font-medium">
                {new Date(letter.createdAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs mb-1">
                Catatan Mahasiswa
              </span>
              <p className="font-medium italic">
                {letter.mahasiswaNote || "-"}
              </p>
            </div>
          </div>
          {letter.adminNotes && (
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-md">
              <span className="text-blue-600 dark:text-blue-400 font-bold block text-xs mb-1">
                Catatan Admin:
              </span>
              <p className="text-sm">{letter.adminNotes}</p>
            </div>
          )}
          {letter.status === "Ditolak" && letter.rejectionReason && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <span className="text-destructive font-bold block text-xs mb-1">
                Alasan Penolakan:
              </span>
              <p className="text-sm font-medium">{letter.rejectionReason}</p>
            </div>
          )}
          {letter.delegateInfo && (
            <div className="pt-4 border-t border-border/50">
              <h3 className="font-bold text-sm mb-2">Informasi Delegasi</h3>
              <p className="text-sm text-muted-foreground">
                Akan diambil oleh:{" "}
                <strong className="text-foreground">
                  {letter.delegateInfo.name}
                </strong>{" "}
                ({letter.delegateInfo.nim})
              </p>
            </div>
          )}

          {handover && (
            <div className="pt-4 border-t border-border/50">
              <h3 className="font-bold text-sm mb-4">
                Bukti Pengambilan Dokumen
              </h3>
              <div className="space-y-3">
                <p className="text-sm">
                  Diambil oleh:{" "}
                  <strong className="font-mono bg-muted px-1.5 py-0.5 rounded">
                    {handover.receiverInfo.nim}
                  </strong>{" "}
                  - {handover.receiverInfo.name}
                  <span className="text-muted-foreground ml-2">
                    (
                    {handover.takenByOption === "pemohon_langsung"
                      ? "Pemohon Langsung"
                      : "Delegasi"}
                    )
                  </span>
                </p>

                {handover.evidenceUrl ? (
                  <div className="mt-4 border rounded-md overflow-hidden bg-muted/30 relative w-full h-100">
                    <Image
                      src={handover.evidenceUrl}
                      alt="Bukti Serah Terima"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic bg-muted/50 p-3 rounded-md text-center">
                    Tidak ada lampiran foto bukti penyerahan.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
