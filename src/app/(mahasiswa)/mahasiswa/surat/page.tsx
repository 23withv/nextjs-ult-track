import { Metadata } from "next";
import { CreateLetterForm } from "./create-letter-form";
import { MahasiswaLetterList } from "./mahasiswa-letter-list";

export const metadata: Metadata = {
  title: "Pengajuan Surat | ULT-Track",
  description: "Ajukan surat baru dan pantau status dokumen Anda.",
};

export default function SuratMahasiswaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Pengajuan Surat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ajukan surat baru dan pantau status dokumen Anda di sini.
          </p>
        </div>

        <CreateLetterForm />
      </div>

      <MahasiswaLetterList />
    </div>
  );
}