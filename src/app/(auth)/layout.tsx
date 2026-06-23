import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { Footer } from "@/components/shared/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo-poliwangi.png"
              alt="Logo Poliwangi"
              width={32}
              height={32}
              className="shrink-0 rounded-full object-cover"
              style={{ width: "32px", height: "32px" }}
            />
            <span className="text-lg font-black tracking-tight text-primary hidden sm:block">
              ULT-Track
            </span>
          </Link>

          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
