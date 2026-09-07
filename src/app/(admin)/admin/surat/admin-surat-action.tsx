"use client";

import { AdminLetterListItem } from "@/types/response/admin/letter";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  item: AdminLetterListItem;
  onProcess: (item: AdminLetterListItem) => void;
  onHandover: (item: AdminLetterListItem) => void;
  onDetail?: (item: AdminLetterListItem) => void;
}

export function AdminSuratAction({ item, onProcess, onHandover }: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/admin/surat/${item._id}`)}
        className="text-xs font-bold cursor-pointer h-8 border-border/50 shadow-sm"
      >
        Detail
      </Button>
      
      {(item.status === "Diajukan" || item.status === "Diproses") && (
        <Button
          size="sm"
          onClick={() => onProcess(item)}
          className="text-xs font-bold cursor-pointer h-8 shadow-sm"
        >
          Proses
        </Button>
      )}

      {item.status === "Siap Diambil" && (
        <Button
          size="sm"
          onClick={() => onHandover(item)}
          className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-8 shadow-sm"
        >
          Serahkan
        </Button>
      )}
    </div>
  );
}
