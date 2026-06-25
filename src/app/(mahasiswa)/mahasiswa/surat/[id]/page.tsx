import { Metadata } from "next";
import { DetailSuratClient } from "./detail-surat";

export const metadata: Metadata = {
  title: "Detail Surat | ULT-Track",
  description: "Lihat rincian pengajuan dan status surat Anda.",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailSuratPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <DetailSuratClient letterId={id} />
    </div>
  );
}