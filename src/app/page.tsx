import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold tracking-tight">ULT-Track</h1>
        <p className="mt-2 text-muted-foreground">
          Sistem Manajemen & Pelacakan Surat Kampus
        </p>
      </main>
    </div>
  );
}