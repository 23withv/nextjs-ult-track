import { NextRequest, NextResponse } from "next/server";
import { RouteHandler, SetError } from "@/lib/api-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { assignDelegateServer } from "@/services/mahasiswa/letter-server-service";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new SetError("Unauthorized access", 401);

    const body = await req.json();
    if (!body.nim) throw new SetError("NIM delegasi wajib diisi", 400);

    const response = await assignDelegateServer(session.user.id, id, body.nim);

    return NextResponse.json({ message: response.message }, { status: response.status });
  });
}