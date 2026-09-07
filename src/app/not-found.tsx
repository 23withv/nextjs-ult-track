import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <FileQuestion className="w-20 h-20 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-black tracking-tight mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Halaman yang Anda cari mungkin telah dipindahkan atau tautan yang Anda masukkan salah.
      </p>
      <Button asChild>
        <Link href="/">Kembali ke Dashboard</Link>
      </Button>
    </div>
  );
}