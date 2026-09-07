import { NextRequest, NextResponse } from "next/server";
import { RouteHandler, SetError } from "@/lib/api-handler";
import { processHandoverServer } from "@/services/admin/handover-server-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  return RouteHandler(async () => {
    // Verifikasi sesi aktif dan otorisasi role pengguna
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new SetError("Akses ditolak", 401);

    const formData = await req.formData();
    const takenByOption = formData.get("takenByOption") as "pemohon_langsung" | "delegasi";
    const receiverNim = formData.get("receiverNim") as string;
    const receiverName = formData.get("receiverName") as string;
    const file = formData.get("file") as File | null;

    if (!takenByOption || !receiverNim || !receiverName) {
      throw new SetError("Data penerima wajib diisi lengkap", 400);
    }

    // Ekstrak payload serah terima dan delegasikan proses ke service
    const res = await processHandoverServer(session.user.id, {
      letterId: id,
      takenByOption,
      receiverNim,
      receiverName,
      file,
    });

    return NextResponse.json(res, { status: res.status });
  });
}