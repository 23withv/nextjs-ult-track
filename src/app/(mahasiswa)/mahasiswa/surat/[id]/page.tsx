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

  return <DetailSuratClient letterId={id} />;
}