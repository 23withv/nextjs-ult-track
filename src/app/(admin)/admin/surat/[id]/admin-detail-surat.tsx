"use client";

import useSWR from "swr";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function DetailAdminSuratClient({ letterId }: { letterId: string }) {
  const { data, isLoading } = useSWR(`/api/admin/letters/${letterId}`, (url) => 
    axios.get(url).then(res => res.data.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Data tidak ditemukan</div>;

  const { letter, handover } = data;

  return (
    <div className="space-y-6">
      <Link href="/admin/surat">
        <Button variant="ghost"><ArrowLeft className="mr-2"/> Kembali</Button>
      </Link>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Detail Resi: {letter.letterNumber}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Pemohon</p>
              <p className="font-bold">{letter.mahasiswaInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{letter.status}</Badge>
            </div>
          </div>
          
          {handover && (
            <div className="pt-4 border-t">
              <h3 className="font-bold">Informasi Penyerahan</h3>
              <p>Diambil oleh: {handover.receiverInfo.name} ({handover.takenByOption})</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}