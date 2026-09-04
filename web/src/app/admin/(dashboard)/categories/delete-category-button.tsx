"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteCategoryButton({ id, disabled }: { id: string; disabled: boolean }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      alert(typeof body?.error === "string" ? body.error : "تعذر حذف الفئة");
      setDeleting(false);
      return;
    }
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="icon-sm"
      onClick={handleDelete}
      disabled={disabled || deleting}
      title={disabled ? "لا يمكن حذف فئة مستخدمة في منتجات — انقل المنتجات لفئة أخرى أولاً" : "حذف"}
    >
      {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
    </Button>
  );
}
