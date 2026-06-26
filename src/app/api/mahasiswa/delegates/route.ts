import { NextResponse } from "next/server";
import { RouteHandler, SetError } from "@/lib/api-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getDelegatedLettersServer } from "@/services/mahasiswa/letter-server-service";

export async function GET() {
  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new SetError("Unauthorized access", 401);

    // Ekstrak sesi mahasiswa dan delegasikan pengambilan daftar delegasi ke service
    const response = await getDelegatedLettersServer(session.user.id);

    return NextResponse.json(
      { 
        message: response.message, 
        data: 'data' in response ? response.data : [] 
      },
      { status: response.status }
    );
  });
}