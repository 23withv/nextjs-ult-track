import { NextRequest, NextResponse } from "next/server";
import { RouteHandler } from "@/lib/api-handler";
import { connectDB } from "@/lib/db";
import MahasiswaModel from "@/models/Mahasiswa";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

type Params = Promise<{ nim: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { nim } = await params;

  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized access");

    await connectDB();

    // Jalankan query MongoDB untuk memvalidasi keberadaan NIM
    const mahasiswa = await MahasiswaModel.findOne({ nim }).select("name prodi").lean();
    
    if (!mahasiswa) {
        return NextResponse.json({ message: "NIM tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ name: mahasiswa.name, prodi: mahasiswa.prodi }, { status: 200 });
  });
}