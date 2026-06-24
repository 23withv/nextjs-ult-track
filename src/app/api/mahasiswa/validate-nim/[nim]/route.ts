import { NextResponse } from "next/server";
import { RouteHandler } from "@/lib/api-handler";
import { connectDB } from "@/lib/db";
import MahasiswaModel from "@/models/Mahasiswa";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(_req: Request, { params }: { params: { nim: string } }) {
  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized access");

    await connectDB();
    const mahasiswa = await MahasiswaModel.findOne({ nim: params.nim }).select("name prodi").lean();
    
    if (!mahasiswa) {
        return NextResponse.json({ message: "NIM tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ name: mahasiswa.name, prodi: mahasiswa.prodi }, { status: 200 });
  });
}