"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/db/schema";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(category?.image ?? null);
  const [hidden, setHidden] = useState(category?.hidden ?? false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("upload failed");
      const { url } = await res.json();
      setImage(url);
    } catch {
      setError("فشل رفع الصورة، حاول مرة أخرى");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      slug: data.get("slug"),
      nameAr: data.get("nameAr"),
      nameEn: data.get("nameEn"),
      sortOrder: Number(data.get("sortOrder") ?? 0),
      image,
      hidden,
    };

    const url = category ? `/api/admin/categories/${category.id}` : "/api/admin/categories";
    const method = category ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(typeof body?.error === "string" ? body.error : "تعذر حفظ الفئة، تحقق من الحقول وحاول مرة أخرى");
      setSaving(false);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="الرابط (slug)">
          <input
            name="slug"
            defaultValue={category?.slug}
            required
            pattern="[a-z0-9-]+"
            className="input"
          />
        </Field>
        <Field label="ترتيب العرض">
          <input
            name="sortOrder"
            type="number"
            defaultValue={category?.sortOrder ?? 0}
            className="input"
          />
        </Field>
        <Field label="الاسم (عربي)">
          <input name="nameAr" defaultValue={category?.nameAr} required className="input" />
        </Field>
        <Field label="الاسم (إنجليزي)">
          <input name="nameEn" defaultValue={category?.nameEn} required className="input" />
        </Field>
      </div>

      <Field label="الصورة/الأيقونة (اختياري)">
        <div className="flex items-center gap-3">
          {image && (
            <div className="relative size-20 overflow-hidden rounded-lg border border-border">
              <Image src={image} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute end-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          )}
          {!image && (
            <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
              {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
              <span className="text-[10px]">إضافة</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>
      </Field>

      <div className="flex items-start justify-between gap-3 rounded-lg border border-border p-3.5">
        <div>
          <div className="text-sm font-medium text-foreground">إخفاء القسم من الموقع</div>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            بينشال من القائمة والصفحة الرئيسية وفلاتر المتجر فورًا، بس منتجاته وصفحته تضل موجودة وما تنكسر روابطها.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={hidden}
          onClick={() => setHidden((v) => !v)}
          className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${hidden ? "justify-end bg-primary" : "justify-start bg-muted"}`}
        >
          <span className="size-5 rounded-full bg-white shadow" />
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={saving || uploading}>
        {saving ? "جارٍ الحفظ..." : "حفظ الفئة"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
