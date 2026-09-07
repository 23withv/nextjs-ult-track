import { DetailSuratClient } from "./detail-surat";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailSuratPage({ params }: Props) {
  const { id } = await params;

  return <DetailSuratClient letterId={id} />;
}