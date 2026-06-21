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

export async function GET() {
  return RouteHandler(async () => {
    const response = await getMahasiswaListServer();

    return NextResponse.json(
      {
        message: response.message,
        ...("data" in response ? { data: response.data } : {}),
      },
      { status: response.status }
    );
  });
}