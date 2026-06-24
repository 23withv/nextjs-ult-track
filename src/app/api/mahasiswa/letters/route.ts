import { NextRequest, NextResponse } from "next/server";
import { RouteHandler } from "@/lib/api-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createLetterServer, getMahasiswaLetterListServer } from "@/services/mahasiswa/letter-server-service";

export async function POST(req: NextRequest) {
  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized access");

    const body = await req.json();
    const response = await createLetterServer(session.user.id, body);

    return NextResponse.json(
      { message: response.message },
      { status: response.status }
    );
  });
}

export async function GET() {
  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized access");

    const response = await getMahasiswaLetterListServer(session.user.id);

    return NextResponse.json(
      { 
        message: response.message, 
        data: 'data' in response ? response.data : [] 
      },
      { status: response.status }
    );
  });
}