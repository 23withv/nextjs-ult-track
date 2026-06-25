import { NextResponse } from "next/server";
import { RouteHandler, SetError } from "@/lib/api-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getAdminLetterStatsServer } from "@/services/admin/admin-letter-server-service";

export async function GET() {
  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new SetError("Unauthorized access", 401);

    const response = await getAdminLetterStatsServer();

    return NextResponse.json(
      { message: response.message, data: 'data' in response ? response.data : null },
      { status: response.status }
    );
  });
}