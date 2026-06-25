import { NextRequest, NextResponse } from "next/server";
import { RouteHandler } from "@/lib/api-handler";
import { getMahasiswaListServer, registerMahasiswaServer } from "@/services/admin/mahasiswa-service";

export async function POST(req: NextRequest) {
  return RouteHandler(async () => {
    const payload = await req.json();

    const response = await registerMahasiswaServer(payload);

    return NextResponse.json(
      {
        message: response.message,
        ...("details" in response ? { details: response.details } : {}),
      },
      { status: response.status }
    );
  });
}

export async function GET(req: NextRequest) {
  return RouteHandler(async () => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const jurusan = searchParams.get("jurusan") || undefined;
    const prodi = searchParams.get("prodi") || undefined;

    const response = await getMahasiswaListServer(page, 10, jurusan, prodi);
    
    return NextResponse.json(
      { 
        message: response.message, 
        data: 'data' in response ? response.data : null 
      }, 
      { status: response.status }
    );
  });
}