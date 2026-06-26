import { NextRequest, NextResponse } from "next/server";
import { RouteHandler, SetError } from "@/lib/api-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getMahasiswaLetterDetailServer } from "@/services/mahasiswa/letter-server-service";

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new SetError("Unauthorized access", 401);

    // Ekstrak ID surat dan delegasikan pengambilan detail ke service
    const response = await getMahasiswaLetterDetailServer(session.user.id, id);

    return NextResponse.json(
      { 
        message: response.message, 
        data: 'data' in response ? response.data : null 
      },
      { status: response.status }
    );
  });
}