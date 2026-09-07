import { NextResponse } from "next/server";
import { RouteHandler, SetError } from "@/lib/api-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getAdminLetterStatsServer } from "@/services/admin/admin-letter-server-service";

export async function GET() {
  return RouteHandler(async () => {
    // Verifikasi sesi aktif dan otorisasi role pengguna
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new SetError("Unauthorized access", 401);

    // Ekstrak sesi admin dan delegasikan pengambilan statistik persuratan ke service
    const response = await getAdminLetterStatsServer();

    return NextResponse.json(
      { message: response.message, data: 'data' in response ? response.data : null },
      { status: response.status }
    );
  });
}