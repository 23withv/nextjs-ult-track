import { MahasiswaList } from "./mahasiswa-list";
import { RegisterForm } from "./register-form";


export default function DaftarMahasiswaPage() {
  return (
    <div className="flex flex-col p-8 w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Manajemen Mahasiswa</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Kelola daftar mahasiswa yang memiliki akses ke sistem pelayanan terpadu.
          </p>
        </div>

        <RegisterForm />
      </div>

      <MahasiswaList />
    </div>
  );
}