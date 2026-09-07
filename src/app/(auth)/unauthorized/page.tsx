import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <ShieldAlert className="w-20 h-20 text-destructive mb-6" />
      <h1 className="text-4xl font-black tracking-tight mb-2">Akses Ditolak</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. 
        Pastikan Anda masuk dengan akun yang sesuai.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
        <Button asChild>
          <Link href="/signin">Masuk Kembali</Link>
        </Button>
      </div>
    </div>
  );
}