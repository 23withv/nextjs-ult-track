import { NextRequest, NextResponse } from "next/server";
import { RouteHandler, SetError } from "@/lib/api-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getAdminDashboardStatsServer } from "@/services/admin/admin-dash-server-service";

export async function GET(req: NextRequest) {
  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin_ult") throw new SetError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()), 10);
    const monthParam = searchParams.get("month");
    const month = monthParam && monthParam !== "all" ? parseInt(monthParam, 10) : undefined;

    const response = await getAdminDashboardStatsServer(year, month);

    return NextResponse.json(
      { message: response.message, data: 'data' in response ? response.data : null },
      { status: response.status }
    );
  });
}