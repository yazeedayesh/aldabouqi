"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("تعذر حذف المنتج");
      setDeleting(false);
      return;
    }
    router.refresh();
  }

  return (
    <Button type="button" variant="destructive" size="icon-sm" onClick={handleDelete} disabled={deleting} title="حذف">
      {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
    </Button>
  );
}
