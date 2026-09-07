import { Navbar } from "@/components/shared/navbar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  ShieldCheck,
  ArrowRight,
  FileSearch,
  CheckCircle,
} from "lucide-react";
import { FadeIn } from "./home-client";
import { Footer } from "@/components/shared/footer";

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col bg-background font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <section className="relative px-6 min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center text-center overflow-hidden py-12">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
          <FadeIn delay={100} direction="up" className="mb-6 p-3 bg-white rounded-2xl shadow-sm border border-border/40">
            <Image
              src="/logo-poliwangi.png"
              alt="Logo Poliwangi"
              width={80}
              height={80}
              className="shrink-0 object-contain mx-auto"
              priority
            />
          </FadeIn>

          <FadeIn delay={300} direction="up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground max-w-4xl leading-[1.15] md:leading-[1.1]">
              Layanan Terpadu <span className="text-primary">Pelacakan Surat</span> Kampus
            </h1>
          </FadeIn>
          
          <FadeIn delay={500} direction="up">
            <p className="mt-4 md:mt-6 text-base md:text-lg font-medium text-muted-foreground max-w-3xl leading-relaxed">
              Sistem informasi modern untuk pengajuan, pemantauan status, dan pengambilan dokumen mahasiswa secara transparan, cepat, dan terstruktur.
            </p>
          </FadeIn>

          <FadeIn delay={700} direction="up" className="mt-8 flex justify-center w-full">
            <Button asChild size="lg" className="h-12 px-8 text-base font-bold shadow-sm">
              <Link href="/signin">
                Masuk ke Sistem <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </FadeIn>
        </section>

        <section className="py-24 px-6 bg-slate-50/50 border-y border-border/40 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <FadeIn className="text-center mb-16" direction="up">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Keunggulan Sistem</h2>
              <p className="text-muted-foreground mt-4 md:text-lg font-medium">Layanan yang dirancang untuk memudahkan administrasi akademik.</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={200} direction="up" className="bg-white p-8 rounded-xl border border-border/50 shadow-sm transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Pelacakan Real-time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pantau pergerakan dan status dokumen Anda kapan saja. Tidak perlu lagi bolak-balik ke loket hanya untuk bertanya.
                </p>
              </FadeIn>

              <FadeIn delay={400} direction="up" className="bg-white p-8 rounded-xl border border-border/50 shadow-sm transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Sistem Terintegrasi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Terhubung langsung dengan seluruh unit pelayanan kampus untuk verifikasi dan pemrosesan yang lebih akurat.
                </p>
              </FadeIn>

              <FadeIn delay={600} direction="up" className="bg-white p-8 rounded-xl border border-border/50 shadow-sm transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Manajemen Terstruktur</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seluruh pengajuan tercatat secara digital dengan nomor resi unik, meminimalisir risiko dokumen hilang atau terselip.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <FadeIn className="text-center mb-16" direction="up">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Alur Pengajuan Surat</h2>
              <p className="text-muted-foreground mt-4 md:text-lg font-medium">Tiga langkah mudah dari awal hingga dokumen diterima.</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10"></div>

              <FadeIn delay={200} direction="up" className="flex flex-col items-center text-center bg-white">
                <div className="w-24 h-24 bg-white border-2 border-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Pengajuan Dokumen</h3>
                <p className="text-muted-foreground">Serahkan dokumen fisik kepada admin, dan daftarkan pengajuan surat.</p>
              </FadeIn>

              <FadeIn delay={400} direction="up" className="flex flex-col items-center text-center bg-white">
                <div className="w-24 h-24 bg-white border-2 border-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <FileSearch className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Pantau Status</h3>
                <p className="text-muted-foreground">Pantau status pengajuan pada dashboard Anda.</p>
              </FadeIn>

              <FadeIn delay={600} direction="up" className="flex flex-col items-center text-center bg-white">
                <div className="w-24 h-24 bg-white border-2 border-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Pengambilan</h3>
                <p className="text-muted-foreground">Jika status sudah selesai, Anda atau delegasi dapat mengambil dokumen di loket.</p>
              </FadeIn>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}