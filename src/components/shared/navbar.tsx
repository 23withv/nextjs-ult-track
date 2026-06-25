"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();

  return (
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

        <div className="flex items-center space-x-2 md:space-x-4">
          <ModeToggle />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-border"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menu Pengguna</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      session.user.role === "admin_ult"
                        ? "/admin/dashboard"
                        : "/mahasiswa/dashboard"
                    }
                    className="flex items-center space-x-2 w-full cursor-pointer"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dasbor</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                  className="flex items-center space-x-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="default"
              size="default"
              className="font-bold"
            >
              <Link href="/signin">Masuk</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
