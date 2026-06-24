import { NextRequest, NextResponse } from "next/server";
import { RouteHandler } from "@/lib/api-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getAdminLetterListServer } from "@/services/admin/admin-letter-server-service";

export async function GET(req: NextRequest) {
  return RouteHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized access");

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || undefined;

    const response = await getAdminLetterListServer(page, limit, status);

    if ('data' in response) {
      return NextResponse.json(
        { message: response.message, data: response.data },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: response.message }, { status: response.status });
  });
}