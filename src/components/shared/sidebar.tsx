"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, FileText, Menu, X, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

interface SidebarProps {
  role: "admin" | "mahasiswa"
}

export function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dasbor", icon: LayoutDashboard },
    { href: "/admin/mahasiswa", label: "Kelola Mahasiswa", icon: Users },
    { href: "/admin/surat", label: "Kelola Surat", icon: FileText },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
  ]

  const mahasiswaLinks = [
    { href: "/mahasiswa/dashboard", label: "Dasbor", icon: LayoutDashboard },
    { href: "/mahasiswa/surat", label: "Pengajuan Surat", icon: FileText },
    { href: "/mahasiswa/delegate", label: "Delegasi", icon: User },
  ]

  // Verifikasi sesi aktif dan otorisasi role pengguna
  const links = role === "admin" ? adminLinks : mahasiswaLinks

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-all"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <Button
        variant="default"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg md:hidden"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <aside
        className={cn(
          "flex flex-col bg-card text-card-foreground transition-all duration-300 ease-in-out h-screen border-r border-border",
          "md:relative md:translate-x-0",
          isCollapsed ? "md:w-16" : "md:w-54",
          "fixed inset-y-0 left-0 z-50 w-54 shadow-xl md:shadow-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-border">
          <span
            className={cn(
              "font-black text-xs tracking-wider uppercase text-muted-foreground transition-opacity",
              isCollapsed ? "md:hidden" : "block"
            )}
          >
            Menu Utama
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto h-8 w-8 text-muted-foreground hidden md:flex"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)} 
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "md:justify-center md:space-x-0 md:px-0"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span
                  className={cn(
                    "truncate",
                    isCollapsed && "md:hidden"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
        <div className="p-2 border-t border-border mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className={cn(
              "flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200 text-destructive hover:bg-destructive/10 cursor-pointer",
              isCollapsed && "md:justify-center md:space-x-0 md:px-0"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "truncate",
                isCollapsed && "md:hidden"
              )}
            >
              Keluar
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}