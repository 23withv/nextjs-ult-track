"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RegisterMahasiswaInput,
  registerMahasiswaSchema,
} from "@/lib/schemas/mahasiswa-schema";
import { postRegisterMahasiswa } from "@/services/client/mahasiswa-client-service";
import { Eye, EyeOff } from "lucide-react";
import { useSWRConfig } from "swr";

export const PRODI_MAP: Record<string, string[]> = {
  "Jurusan Bisnis & Informatika": [
    "Teknologi Rekayasa Perangkat Lunak",
    "Bisnis Digital",
    "Teknologi Rekayasa Komputer",
  ],
  "Jurusan Teknik Sipil": [
    "Teknik Sipil",
    "Teknologi Rekayasa Konstruksi Jalan dan Jembatan",
  ],
  "Jurusan Teknik Mesin": [
    "Teknologi Rekayasa Manufaktur",
    "Teknik Manufaktur Kapal",
  ],
  "Jurusan Pertanian": [
    "Agribisnis",
    "Teknologi Pengolahan Hasil Ternak",
    "Pengembangan Produk Agroindustri",
    "Teknologi Produksi Ternak",
    "Teknologi Produksi Tanaman Pangan",
    "Teknologi Budidaya Perikanan",
  ],
  "Jurusan Pariwisata": [
    "Manajemen Bisnis Pariwisata",
    "Destinasi Pariwisata",
    "Pengelolaan Perhotelan",
  ],
};

export function RegisterForm() {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<RegisterMahasiswaInput>({
    resolver: zodResolver(registerMahasiswaSchema as never),
    defaultValues: {
      nim: "",
      name: "",
      email: "",
      password: "",
      jurusan: "",
      prodi: "",
    },
  });

  const selectedJurusan = useWatch({
    control: form.control,
    name: "jurusan",
  });
  const availableProdi = PRODI_MAP[selectedJurusan] || [];

  const onSubmit = async (values: RegisterMahasiswaInput) => {
    try {
      setIsLoading(true);
      const result = await postRegisterMahasiswa(values);
      toast.success(result.message);

      form.reset();
      setOpen(false);

      mutate(
        (key) => Array.isArray(key) && key[0] === "/api/admin/mahasiswa",
        undefined,
        { revalidate: true }
      );

    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    form.reset();
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="font-bold cursor-pointer">+ Tambah Mahasiswa</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Pendaftaran Akun</DialogTitle>
          <DialogDescription>
            Isi data berikut untuk memberikan akses masuk ke mahasiswa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nim" className="text-sm font-bold">NIM</Label>
            <Input
              {...form.register("nim")}
              id="nim"
              placeholder="Masukkan NIM mahasiswa"
              disabled={isLoading}
              className="h-10"
            />
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.nim?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold">Nama Lengkap</Label>
            <Input
              {...form.register("name")}
              id="name"
              placeholder="Masukkan nama lengkap"
              disabled={isLoading}
              className="h-10"
            />
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.name?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold">Email</Label>
            <Input
              {...form.register("email")}
              id="email"
              type="email"
              placeholder="mahasiswa@kampus.ac.id"
              disabled={isLoading}
              className="h-10"
            />
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.email?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-bold">Password Akun</Label>
            <div className="relative">
              <Input
                {...form.register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                className="h-10 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle password visibility</span>
              </button>
            </div>
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.password?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jurusan" className="text-sm font-bold">Jurusan</Label>
            <select
              {...form.register("jurusan", {
                onChange: () => form.setValue("prodi", ""),
              })}
              id="jurusan"
              disabled={isLoading}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Pilih Jurusan</option>
              {Object.keys(PRODI_MAP).map((jurusanName) => (
                <option key={jurusanName} value={jurusanName}>
                  {jurusanName}
                </option>
              ))}
            </select>
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.jurusan?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prodi" className="text-sm font-bold">Program Studi</Label>
            <select
              {...form.register("prodi")}
              id="prodi"
              disabled={isLoading || !selectedJurusan}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Pilih Program Studi</option>
              {availableProdi.map((prodiName) => (
                <option key={prodiName} value={prodiName}>
                  {prodiName}
                </option>
              ))}
            </select>
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.prodi?.message}
            </p>
          </div>

          <Button type="submit" className="w-full h-11 font-bold mt-2 cursor-pointer" disabled={isLoading}>
            {isLoading ? "Menyimpan Data..." : "Simpan Pendaftaran"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}