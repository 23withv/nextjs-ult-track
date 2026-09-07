import { AdminLetterList } from "./admin-letter-list";

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