import { Metadata } from "next";
import { AdminLetterList } from "./admin-letter-list";

export const metadata: Metadata = {
  title: "Antrean Surat | Admin ULT-Track",
  description: "Kelola antrean pengajuan surat dan perbarui status dokumen mahasiswa.",
};

export default function AdminSuratPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Manajemen Antrean Surat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau pengajuan baru, proses dokumen, dan perbarui status pengambilan di sini.
          </p>
        </div>
      </div>

      <AdminLetterList />
    </div>
  );
}