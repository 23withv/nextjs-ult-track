import { Metadata } from "next";
import { AdminDashboardClient } from "./admin-dashboard";

export const metadata: Metadata = {
  title: "Dasbor Utama | Admin ULT-Track",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Dasbor Utama</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pantau statistik layanan terpadu dan pengajuan surat mahasiswa.
        </p>
      </div>
      <AdminDashboardClient />
    </div>
  );
}