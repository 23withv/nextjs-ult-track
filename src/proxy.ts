import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Redirect jika sudah login
  if (pathname.startsWith("/signin") && token) {
    // Verifikasi sesi aktif dan otorisasi role pengguna
    return NextResponse.redirect(new URL(token.role === "admin_ult" ? "/admin/dashboard" : "/mahasiswa/dashboard", request.url));
  }

  // rute Admin
  if (pathname.startsWith("/admin") && token?.role !== "admin_ult") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // rute Mahasiswa
  if (pathname.startsWith("/mahasiswa") && token?.role !== "mahasiswa") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mahasiswa/:path*", "/signin"],
};