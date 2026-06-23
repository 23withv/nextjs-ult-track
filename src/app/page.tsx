import { Navbar } from "@/components/shared/navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl font-black tracking-tight text-primary mb-4">
          ULT-Track
        </h1>
        <p className="text-lg font-medium text-muted-foreground max-w-lg">
          Sistem Manajemen & Pelacakan Surat Kampus terpadu untuk pelayanan yang
          lebih cepat, transparan, dan terstruktur.
        </p>
      </main>
    </div>
  );
}
