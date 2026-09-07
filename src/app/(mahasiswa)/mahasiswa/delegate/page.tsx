import { DelegateListClient } from "./delegate-list";

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