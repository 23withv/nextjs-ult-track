"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export function RegisterForm() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<RegisterMahasiswaInput>({
    resolver: zodResolver(registerMahasiswaSchema as never),
    defaultValues: {
      nim: "",
      name: "",
      email: "",
      password: "",
      prodi: "",
    },
  });

  const onSubmit = async (values: RegisterMahasiswaInput) => {
    try {
      setIsLoading(true);
      const result = await postRegisterMahasiswa(values);
      toast.success(result.message);

      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="font-bold">+ Tambah Mahasiswa</Button>
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
            <Input
              {...form.register("password")}
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              className="h-10"
            />
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.password?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prodi" className="text-sm font-bold">Program Studi</Label>
            <select
              {...form.register("prodi")}
              id="prodi"
              disabled={isLoading}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Pilih Program Studi</option>
              <option value="Teknologi Rekayasa Perangkat Lunak">Teknologi Rekayasa Perangkat Lunak</option>
              <option value="Teknik Komputer">Teknik Komputer</option>
              <option value="Teknik Mesin">Teknik Mesin</option>
            </select>
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.prodi?.message}
            </p>
          </div>

          <Button type="submit" className="w-full h-11 font-bold mt-2" disabled={isLoading}>
            {isLoading ? "Menyimpan Data..." : "Simpan Pendaftaran"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}