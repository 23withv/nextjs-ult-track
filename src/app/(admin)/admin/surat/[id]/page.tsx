import { DetailAdminSuratClient } from "./admin-detail-surat";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <DetailAdminSuratClient letterId={id} />
  );
}