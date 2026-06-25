import { Metadata } from "next";
import { DelegateListClient } from "./delegate-list";

export const metadata: Metadata = {
  title: "Tugas Delegasi | ULT-Track",
  description: "Daftar dokumen di mana Anda ditunjuk sebagai delegasi untuk pengambilan fisik.",
};

export default function DelegatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Tugas Delegasi</h1>
        <p className="text-sm text-muted-foreground mt-1 font-medium">
          Daftar dokumen milik mahasiswa lain yang perlu Anda ambil di loket. Tunjukkan <b>Nomor Resi</b> di bawah kepada admin bertugas.
        </p>
      </div>

      <DelegateListClient />
    </div>
  );
}