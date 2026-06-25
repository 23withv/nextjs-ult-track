import { NextRequest, NextResponse } from "next/server";
import { RouteHandler } from "@/lib/api-handler";
import { getAdminLetterDetailServer, updateLetterStatusServer } from "@/services/admin/admin-letter-server-service";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  
  return RouteHandler(async () => {
    const body = await req.json();

    const res = await updateLetterStatusServer(id, {
      status: body.status,
      adminNotes: body.adminNotes,
      rejectionReason: body.rejectionReason,
    });
    
    return NextResponse.json(res, { status: res.status });
  });
}

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  return RouteHandler(async () => {
    const res = await getAdminLetterDetailServer(id);

    if ('data' in res) {
      return NextResponse.json(
        { message: res.message, data: res.data },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { message: res.message, details: res.details },
      { status: res.status }
    );
  });
}