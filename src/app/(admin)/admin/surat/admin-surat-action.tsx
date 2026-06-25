"use client";

import { AdminLetterListItem } from "@/types/response/admin/letter";
import { useRouter } from "next/navigation";

interface Props {
  item: AdminLetterListItem;
  onProcess: (item: AdminLetterListItem) => void;
  onHandover: (item: AdminLetterListItem) => void;
  onDetail?: (item: AdminLetterListItem) => void;
}

export function AdminSuratAction({ item, onProcess, onHandover }: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => router.push(`/admin/surat/${item._id}`)}
        className="text-xs font-black text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
      >
        Detail
      </button>
      {(item.status === "Diajukan" || item.status === "Diproses") && (
        <button
          onClick={() => onProcess(item)}
          className="text-xs font-black text-primary hover:underline cursor-pointer"
        >
          Proses
        </button>
      )}

      {item.status === "Siap Diambil" && (
        <button
          onClick={() => onHandover(item)}
          className="text-xs font-black text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
        >
          Serahkan
        </button>
      )}
    </div>
  );
}
