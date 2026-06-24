import { Metadata } from "next";
import { ReferenceList } from "./reference-form";

export const metadata: Metadata = { title: "Pengaturan Referensi" };

export default function PengaturanPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Pengaturan Referensi</h1>
        <p className="text-sm text-muted-foreground">Kelola master data sistem.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ReferenceList type="unit" label="Unit Tujuan" />
        <ReferenceList type="letterType" label="Jenis Surat" />
      </div>
    </div>
  );
}