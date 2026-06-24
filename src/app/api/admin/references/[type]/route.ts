import { NextRequest, NextResponse } from "next/server";
import { RouteHandler } from "@/lib/api-handler";
import { getReferenceListServer, createReferenceServer, softDeleteReferenceServer } from "@/services/admin/reference-service";

type Params = Promise<{ type: "unit" | "letterType" }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { type } = await params;
  return RouteHandler(async () => {
    const res = await getReferenceListServer(type);
    return NextResponse.json(res, { status: res.status });
  });
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { type } = await params;
  return RouteHandler(async () => {
    const { name } = await req.json();
    const res = await createReferenceServer(type, name);
    return NextResponse.json(res, { status: res.status });
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { type } = await params;
  return RouteHandler(async () => {
    const { id } = await req.json();
    const res = await softDeleteReferenceServer(type, id);
    return NextResponse.json(res, { status: res.status });
  });
}