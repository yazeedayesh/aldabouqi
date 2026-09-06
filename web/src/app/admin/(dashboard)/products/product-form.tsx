"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Category, Product, ProductImage } from "@/db/schema";

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

type PendingUpload = { id: string; name: string; progress: number; error?: string };

function uploadFile(file: File, onProgress: (pct: number) => void): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("استجابة غير متوقعة من الخادم"));
        }
      } else {
        reject(new Error(`فشل الرفع (رمز ${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("تعذر الاتصال بالخادم أثناء الرفع"));
    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const router = useRouter();
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(product?.category ?? categories[0]?.slug ?? "");
  const [condition, setCondition] = useState(product?.condition ?? "good");
  const [status, setStatus] = useState(product?.status ?? "available");

  function handleFiles(files: File[]) {
    for (const file of files) {
      const id = crypto.randomUUID();
      if (!file.type.startsWith("image/")) {
        setPending((prev) => [...prev, { id, name: file.name, progress: 0, error: "هذا الملف ليس صورة" }]);
        continue;
      }
      setPending((prev) => [...prev, { id, name: file.name, progress: 0 }]);
      uploadFile(file, (progress) => {
        setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress } : p)));
      })
        .then(({ url }) => {
          setImages((prev) => [...prev, { url, alt: "" }]);
          setPending((prev) => prev.filter((p) => p.id !== id));
        })
        .catch((err: Error) => {
          setPending((prev) => prev.map((p) => (p.id === id ? { ...p, error: err.message } : p)));
        });
    }
  }

  function dismissPending(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  function updateAlt(index: number, alt: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  function setPrimary(index: number) {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeImage(index: number) {
    if (!confirm("حذف هذه الصورة؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <p className="mb-2 text-xs text-muted-foreground">
          أول صورة (المؤشرة بنجمة ذهبية) هي الصورة الرئيسية المعروضة بكل مكان بالموقع.
        </p>

        {images.length > 0 && (
          <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img, i) => (
              <div
                key={img.url}
                className={cn(
                  "space-y-2 rounded-xl border p-2",
                  i === 0 ? "border-primary ring-2 ring-primary/40" : "border-border"
                )}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                  <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                  {i === 0 && (
                    <span className="absolute start-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                      <Star className="size-3.5 fill-current" />
                    </span>
                  )}
                </div>
                <input
                  value={img.alt}
                  onChange={(e) => updateAlt(i, e.target.value)}
                  placeholder="نص alt (يُولَّد تلقائيًا إذا تُرك فاضي)"
                  className="input !py-1.5 text-xs"
                />
                <div className="flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => setPrimary(i)}
                    disabled={i === 0}
                    title="تعيين كصورة رئيسية"
                    className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Star className="size-3.5" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      title="تحريك لليمين"
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowRight className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      title="تحريك لليسار"
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowLeft className="size-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    title="حذف الصورة"
                    className="flex size-7 items-center justify-center rounded-md border border-border text-destructive transition-colors hover:border-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pending.length > 0 && (
          <div className="mb-3 space-y-2">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-2 text-xs">
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                {p.error ? (
                  <>
                    <span className="text-destructive">{p.error}</span>
                    <button type="button" onClick={() => dismissPending(p.id)} className="text-muted-foreground hover:text-foreground">
                      <Trash2 className="size-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(Array.from(e.dataTransfer.files));
          }}
          className={cn(
            "flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-sm text-muted-foreground transition-colors",
            dragOver ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary hover:text-primary"
          )}
        >
          <Upload className="size-5" />
          <span>اسحب الصور هنا أو اضغط للاختيار (يمكن اختيار أكثر من صورة)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={saving || pending.some((p) => !p.error)}>
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
