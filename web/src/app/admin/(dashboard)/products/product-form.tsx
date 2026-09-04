"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Product } from "@/db/schema";

const conditions = [
  { value: "excellent", label: "ممتازة" },
  { value: "good", label: "جيدة" },
  { value: "fair", label: "مقبولة" },
];

const statuses = [
  { value: "available", label: "متوفر" },
  { value: "reserved", label: "محجوز" },
  { value: "sold", label: "مباع" },
  { value: "draft", label: "مسودة" },
];

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(product?.category ?? categories[0]?.slug ?? "");
  const [condition, setCondition] = useState(product?.condition ?? "good");
  const [status, setStatus] = useState(product?.status ?? "available");

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
      setImages((prev) => [...prev, url]);
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
    const priceRaw = data.get("price");
    const payload = {
      slug: data.get("slug"),
      titleAr: data.get("titleAr"),
      titleEn: data.get("titleEn"),
      descriptionAr: data.get("descriptionAr"),
      descriptionEn: data.get("descriptionEn"),
      category,
      condition,
      status,
      price: priceRaw ? Number(priceRaw) : null,
      area: data.get("area") || null,
      images,
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("تعذر حفظ المنتج، تحقق من الحقول وحاول مرة أخرى");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="الرابط (slug)">
          <input
            name="slug"
            defaultValue={product?.slug}
            required
            pattern="[a-z0-9-]+"
            className="input"
          />
        </Field>
        <Field label="المنطقة (اختياري)">
          <input name="area" defaultValue={product?.area ?? ""} className="input" />
        </Field>
        <Field label="العنوان (عربي)">
          <input name="titleAr" defaultValue={product?.titleAr} required className="input" />
        </Field>
        <Field label="العنوان (إنجليزي)">
          <input name="titleEn" defaultValue={product?.titleEn} required className="input" />
        </Field>
      </div>

      <Field label="الوصف (عربي)">
        <textarea
          name="descriptionAr"
          defaultValue={product?.descriptionAr}
          required
          rows={3}
          className="input resize-none"
        />
      </Field>
      <Field label="الوصف (إنجليزي)">
        <textarea
          name="descriptionEn"
          defaultValue={product?.descriptionEn}
          required
          rows={3}
          className="input resize-none"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="الفئة">
          <Select
            items={categories.map((c) => ({ value: c.slug, label: c.nameAr }))}
            value={category}
            onValueChange={(v) => v && setCategory(v)}
          >
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>{c.nameAr}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="الحالة (جودة)">
          <Select items={conditions} value={condition} onValueChange={(v) => v && setCondition(v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {conditions.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="حالة العرض">
          <Select items={statuses} value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="السعر (د.أ، اختياري)">
          <input
            name="price"
            type="number"
            min={0}
            defaultValue={product?.price ?? undefined}
            placeholder="عند المعاينة"
            className="input"
          />
        </Field>
      </div>

      <Field label="الصور">
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative size-20 overflow-hidden rounded-lg border border-border">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                className="absolute end-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
          <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            <span className="text-[10px]">إضافة</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={saving || uploading}>
        {saving ? "جارٍ الحفظ..." : "حفظ المنتج"}
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
