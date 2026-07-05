import { Footer } from "@/components/shared/footer"
import { Navbar } from "@/components/shared/navbar"
import { Sidebar } from "@/components/shared/sidebar"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dasbor Mahasiswa",
  description: "Halaman Mahasiswa",
};

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      <Sidebar role="mahasiswa" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <div className="flex-1 flex flex-col overflow-y-auto bg-background">
          <main className="flex-1 px-4 py-6 md:p-6">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}