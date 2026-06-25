import { NextResponse } from "next/server";
import { RouteHandler } from "@/lib/api-handler";
import { getMahasiswaStatsServer } from "@/services/admin/mahasiswa-service";

export async function GET() {
  return RouteHandler(async () => {
    const response = await getMahasiswaStatsServer();
    
    return NextResponse.json(
      { 
        message: response.message, 
        data: 'data' in response ? response.data : null 
      }, 
      { status: response.status }
    );
  });
}