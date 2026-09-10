"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Plus, Star, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Category, ContactNumber, Product, ProductSpec } from "@/db/schema";

const conditions = [
  { value: "excellent", label: "ممتازة" },
  { value: "good", label: "جيدة جدًا" },
  { value: "fair", label: "جيدة" },
];

const visibilityOptions = [
  { value: "published", label: "منشور" },
  { value: "hidden", label: "مخفي" },
  { value: "draft", label: "مسودة" },
] as const;

const statusOptions = [
  { value: "available", label: "متوفّر" },
  { value: "reserved", label: "محجوز" },
  { value: "sold", label: "مباع" },
] as const;

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProductForm({
  product,
  categories,
  contactNumbers,
}: {
  product?: Product;
  categories: Category[];
  contactNumbers: ContactNumber[];
}) {
  const router = useRouter();
  const [images, setImages] = useState<{ url: string; alt: string }[]>(product?.images ?? []);
  const [specs, setSpecs] = useState<ProductSpec[]>(product?.specs ?? []);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [titleAr, setTitleAr] = useState(product?.titleAr ?? "");
  const [titleEn, setTitleEn] = useState(product?.titleEn ?? "");
  const [descriptionAr, setDescriptionAr] = useState(product?.descriptionAr ?? "");
  const [descriptionEn, setDescriptionEn] = useState(product?.descriptionEn ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  // Employees adding products never touch this — the slug is generated
  // automatically (from the English title on create, preserved as-is on
  // edit) unless an admin deliberately opts into manual SEO editing here.
  const [manualSlugEdit, setManualSlugEdit] = useState(false);
  const [category, setCategory] = useState(product?.category ?? categories[0]?.slug ?? "");
  const [condition, setCondition] = useState(product?.condition ?? "good");
  const [visibility, setVisibility] = useState(product?.visibility ?? "published");
  const [visibilityTouched, setVisibilityTouched] = useState(false);
  const [status, setStatus] = useState(product?.status ?? "available");
  const [priceOnRequest, setPriceOnRequest] = useState(product ? product.price == null : false);
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : "");
  const [negotiable, setNegotiable] = useState(product?.negotiable ?? false);
  const [whatsappContactNumberId, setWhatsappContactNumberId] = useState(product?.whatsappContactNumberId ?? "");
  const [callContactNumberId, setCallContactNumberId] = useState(product?.callContactNumberId ?? "");

  const autoSlug = product ? product.slug : slugify(titleEn || titleAr);
  const effectiveSlug = manualSlugEdit ? slug : autoSlug;
  const defaultNumber = contactNumbers.find((n) => n.isDefault);

  const seoTitle = titleAr
    ? `${titleAr}${price && !priceOnRequest ? ` - ${price} د.أ` : ""} | شركة الدابوقي`
    : "…";
  const seoDescription = descriptionAr ? descriptionAr.slice(0, 155) : "…";

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

  function addSpec() {
    setSpecs((prev) => [...prev, { labelAr: "", labelEn: "", valueAr: "", valueEn: "" }]);
  }

  function updateSpec(index: number, field: keyof ProductSpec, value: string) {
    setSpecs((prev) => prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)));
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  async function save(targetVisibility: "draft" | "publish") {
    setSaving(targetVisibility);
    setError(null);

    const payload = {
      // Omitted entirely unless the admin opted into manual editing — the
      // API auto-generates a unique slug on create and preserves the
      // existing one on edit when this is absent.
      ...(manualSlugEdit ? { slug } : {}),
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      category,
      condition,
      status,
      // Both buttons force their own literal meaning ("حفظ ونشر" -> always
      // published, "حفظ كمسودة" -> always draft) UNLESS the admin
      // deliberately clicked the tri-toggle themselves this session, in
      // which case that explicit choice wins — the only way to reach
      // "hidden" through this form. Without this, editing an
      // already-hidden product and clicking "حفظ ونشر" silently kept it
      // hidden instead of republishing it (found during the site owner's
      // own QA pass, 2026-09-07).
      visibility: visibilityTouched ? visibility : targetVisibility === "draft" ? "draft" : "published",
      price: priceOnRequest ? null : price ? Number(price) : null,
      negotiable,
      area: null,
      whatsappContactNumberId: whatsappContactNumberId || null,
      callContactNumberId: callContactNumberId || null,
      images,
      specs: specs.filter((s) => s.labelAr.trim() && s.labelEn.trim() && s.valueAr.trim() && s.valueEn.trim()),
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
      setSaving(null);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save("publish");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <div className="space-y-4">
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="اسم المنتج (عربي)">
                <input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  required
                  className="admin-input"
                />
              </Field>
              <Field label="اسم المنتج (إنجليزي)">
                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  required
                  className="admin-input"
                />
              </Field>
            </div>
            <Field label="الرابط (slug)" hint="يتولّد تلقائيًا من الاسم — ما بتحتاج تلمسه">
              {manualSlugEdit ? (
                <div className="flex items-center gap-1 rounded-[14px] bg-admin-input px-4 py-0 h-[50px] font-mono text-[13.5px] text-admin-muted-2">
                  <span dir="ltr">/store/{category || "…"}/</span>
                  <input
                    dir="ltr"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    className="min-w-0 flex-1 bg-transparent font-semibold text-foreground outline-none"
                  />
                </div>
              ) : (
                <div className="flex h-[50px] items-center justify-between gap-2 rounded-[14px] bg-admin-input px-4 font-mono text-[13.5px] text-admin-muted-2">
                  <span dir="ltr" className="truncate">
                    /store/{category || "…"}/{autoSlug || "…"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(autoSlug);
                      setManualSlugEdit(true);
                    }}
                    className="shrink-0 text-[12.5px] font-semibold text-primary"
                  >
                    تعديل يدوي
                  </button>
                </div>
              )}
            </Field>
          </AdminCard>

          <AdminCard>
            <Field label="الوصف (عربي)">
              <textarea
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                required
                rows={3}
                className="admin-input min-h-24 resize-none py-3.5 leading-[1.85]"
              />
            </Field>
            <Field label="الوصف (إنجليزي)">
              <textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                required
                rows={3}
                className="admin-input min-h-24 resize-none py-3.5 leading-[1.85]"
              />
            </Field>
          </AdminCard>

          <AdminCard>
            <div className="mb-1.5 flex items-center justify-between">
              <h3 className="font-heading text-[17px] font-extrabold text-foreground">صور المنتج</h3>
              <span className="text-[12.5px] text-admin-muted">
                {images.length} {images.length === 1 ? "صورة" : "صور"} · الأولى بالترتيب هي الرئيسية
              </span>
            </div>
            <p className="mb-4 text-[12.5px] leading-[1.75] text-admin-muted">
              النص البديل إلزامي لكل صورة — لو تركته فاضي بيتولّد تلقائيًا من اسم المنتج والقسم. رتّب الصور بالأسهم.
            </p>

            {images.length > 0 && (
              <div className="mb-3.5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img, i) => (
                  <div
                    key={img.url}
                    className={cn(
                      "rounded-[18px] p-3",
                      i === 0 ? "border-2 border-primary bg-accent/40" : "border-[1.5px] border-admin-border bg-white"
                    )}
                  >
                    <div className="relative mb-2.5 aspect-4/3 overflow-hidden rounded-xl bg-secondary">
                      <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                      {i === 0 ? (
                        <>
                          <span className="absolute start-2 top-2 flex size-[30px] items-center justify-center rounded-full bg-primary">
                            <Star className="size-[15px] fill-white text-white" />
                          </span>
                          <span className="absolute bottom-2 start-2 flex h-6 items-center rounded-full bg-primary px-2.5 text-[11px] font-bold text-white">
                            الصورة الرئيسية
                          </span>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPrimary(i)}
                          title="تعيين كصورة رئيسية"
                          className="absolute start-2 top-2 flex size-[30px] items-center justify-center rounded-full bg-white/92"
                        >
                          <Star className="size-[15px] text-admin-muted" />
                        </button>
                      )}
                    </div>
                    <div className="mb-1.5 text-[11.5px] font-semibold text-admin-muted-2">النص البديل (alt)</div>
                    <textarea
                      value={img.alt}
                      onChange={(e) => updateAlt(i, e.target.value)}
                      placeholder="يتولّد تلقائيًا إذا تُرك فاضي"
                      rows={2}
                      className="mb-2.5 w-full resize-none rounded-[10px] bg-admin-input px-2.5 py-2 text-xs leading-[1.6] text-foreground outline-none placeholder:text-admin-faint"
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveImage(i, -1)}
                        disabled={i === 0}
                        title="تحريك لليمين"
                        className="flex h-[34px] flex-1 items-center justify-center rounded-[10px] bg-admin-divider text-admin-muted-2 transition-opacity disabled:opacity-30"
                      >
                        <ArrowRight className="size-[15px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === images.length - 1}
                        title="تحريك لليسار"
                        className="flex h-[34px] flex-1 items-center justify-center rounded-[10px] bg-admin-divider text-admin-muted-2 transition-opacity disabled:opacity-30"
                      >
                        <ArrowLeft className="size-[15px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        title="حذف الصورة"
                        className="flex h-[34px] flex-1 items-center justify-center rounded-[10px] bg-admin-danger-bg text-admin-danger"
                      >
                        <Trash2 className="size-[15px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pending.length > 0 && (
              <div className="mb-3.5 space-y-2">
                {pending.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl border border-admin-border p-2.5 text-xs">
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                    {p.error ? (
                      <>
                        <span className="text-admin-danger">{p.error}</span>
                        <button type="button" onClick={() => dismissPending(p.id)} className="text-admin-muted hover:text-foreground">
                          <Trash2 className="size-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-admin-divider">
                          <div className="h-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="w-8 text-admin-muted">{p.progress}%</span>
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
                "flex min-h-[130px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[18px] border-2 border-dashed text-sm font-bold transition-colors",
                dragOver ? "border-primary bg-accent/40 text-primary" : "border-admin-border bg-[#FCFCFD] text-admin-muted-2"
              )}
            >
              <Upload className="size-5" />
              <span>اسحب الصور هون أو اضغط للاختيار</span>
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
          </AdminCard>

          <AdminCard>
            <h3 className="mb-1.5 font-heading text-[17px] font-extrabold text-foreground">المواصفات</h3>
            <p className="mb-4 text-[12.5px] leading-[1.75] text-admin-muted">
              تظهر كجدول بصفحة المنتج. لو تركتها فاضية، الجدول بيختفي كليًا من الصفحة.
            </p>
            {specs.length > 0 && (
              <div className="mb-2.5 space-y-2.5">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_44px] gap-2.5 text-[12.5px] font-semibold text-admin-muted">
                  <div>الخاصية</div>
                  <div>القيمة</div>
                  <div />
                </div>
                {specs.map((spec, i) => (
                  <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_44px] gap-2.5">
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        value={spec.labelAr}
                        onChange={(e) => updateSpec(i, "labelAr", e.target.value)}
                        placeholder="عربي"
                        className="admin-input h-[50px]"
                      />
                      <input
                        value={spec.labelEn}
                        onChange={(e) => updateSpec(i, "labelEn", e.target.value)}
                        placeholder="English"
                        className="admin-input h-[50px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        value={spec.valueAr}
                        onChange={(e) => updateSpec(i, "valueAr", e.target.value)}
                        placeholder="عربي"
                        className="admin-input h-[50px]"
                      />
                      <input
                        value={spec.valueEn}
                        onChange={(e) => updateSpec(i, "valueEn", e.target.value)}
                        placeholder="English"
                        className="admin-input h-[50px]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      className="flex h-[50px] items-center justify-center rounded-[14px] bg-admin-danger-bg text-admin-danger"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addSpec}
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-admin-border text-[13.5px] font-semibold text-primary"
            >
              <Plus className="size-4" />
              أضف صف
            </button>
          </AdminCard>
        </div>

        <div className="space-y-4">
          <AdminCard>
            <h3 className="mb-3.5 font-heading text-[17px] font-extrabold text-foreground">النشر</h3>
            <TriToggle
              options={visibilityOptions}
              value={visibility}
              onChange={(v) => {
                setVisibility(v);
                setVisibilityTouched(true);
              }}
            />
            <div className="mt-2 rounded-[14px] bg-admin-input p-3.5 text-[12.5px] leading-[1.8] text-admin-muted-2">
              <strong className="text-foreground">مخفي</strong> = بينشال من الموقع الحي فورًا، بس صفحته بتضل موجودة وما
              بتنكسر روابطها. <strong className="text-foreground">مسودة</strong> = ما انعرض أبدًا.
            </div>

            <h4 className="mb-2 mt-4.5 text-sm font-semibold text-admin-muted-2">التوفّر</h4>
            <TriToggle options={statusOptions} value={status} onChange={setStatus} />
          </AdminCard>

          <AdminCard>
            <h3 className="mb-3.5 font-heading text-[17px] font-extrabold text-foreground">التصنيف والسعر</h3>
            <Field label="القسم">
              <Select items={categories.map((c) => ({ value: c.slug, label: c.nameAr }))} value={category} onValueChange={(v) => v && setCategory(v)}>
                <SelectTrigger className="admin-select-trigger"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>{c.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="حالة القطعة">
              <Select items={conditions} value={condition} onValueChange={(v) => v && setCondition(v)}>
                <SelectTrigger className="admin-select-trigger"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {conditions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="السعر (د.أ)">
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={priceOnRequest}
                placeholder={priceOnRequest ? "عند التواصل" : undefined}
                className="admin-input disabled:opacity-50"
              />
            </Field>

            <ToggleRow
              title="السعر عند التواصل"
              hint="لما تشغّله بينخفي حقل السعر، وبينخفي معه خيار الدفع عند الاستلام تلقائيًا."
              checked={priceOnRequest}
              onChange={setPriceOnRequest}
            />
            <ToggleRow title="السعر قابل للتفاوض" checked={negotiable} onChange={setNegotiable} />
          </AdminCard>

          <AdminCard>
            <h3 className="mb-1.5 font-heading text-[17px] font-extrabold text-foreground">أرقام التواصل لهذا المنتج</h3>
            <p className="mb-4 text-[12.5px] leading-[1.75] text-admin-muted">
              تقدر تخصص رقم مختلف لكل منتج. لو ما اخترت، بينستخدم الرقم الافتراضي.
            </p>
            <Field label="رقم واتساب">
              <ContactNumberSelect
                numbers={contactNumbers.filter((n) => n.supportsWhatsapp)}
                value={whatsappContactNumberId}
                onChange={setWhatsappContactNumberId}
                defaultLabel={defaultNumber ? `الرقم الرئيسي · ${defaultNumber.phoneE164}` : "الرقم الافتراضي"}
              />
            </Field>
            <Field label="رقم الاتصال">
              <ContactNumberSelect
                numbers={contactNumbers.filter((n) => n.supportsCall)}
                value={callContactNumberId}
                onChange={setCallContactNumberId}
                defaultLabel="نفس رقم واتساب"
              />
            </Field>
            <div className="mt-1 rounded-[14px] bg-accent p-3.5 text-[12.5px] leading-[1.8] text-primary">
              الأرقام بتتدار من صفحة «الإعدادات» بالقائمة الجانبية.
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="mb-1.5 font-heading text-[17px] font-extrabold text-foreground">السيو</h3>
            <p className="mb-4 text-[12.5px] leading-[1.75] text-admin-muted">يتولّد تلقائيًا من العنوان والوصف.</p>
            <div className="rounded-[14px] bg-admin-input p-4">
              <div className="mb-2 text-[11px] text-admin-muted">معاينة نتيجة جوجل</div>
              <div dir="ltr" className="mb-1 text-left font-mono text-xs text-primary">
                aldabouqi.com › store › {category || "…"}
              </div>
              <div className="mb-1.5 truncate text-[15px] font-semibold leading-[1.4] text-[#1a0dab]">{seoTitle}</div>
              <div className="line-clamp-2 text-[12.5px] leading-[1.65] text-[#4d5156]">{seoDescription}</div>
            </div>
          </AdminCard>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-2.5 border-t border-admin-border bg-admin-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Button
          type="button"
          variant="secondary"
          disabled={saving !== null}
          onClick={() => save("draft")}
          className="h-11 rounded-full bg-admin-input px-4.5 text-admin-muted-2"
        >
          حفظ كمسودة
        </Button>
        <Button type="submit" disabled={saving !== null} className="h-11 rounded-full px-6">
          {saving ? "جارٍ الحفظ..." : "حفظ ونشر"}
        </Button>
      </div>
    </form>
  );
}

function AdminCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[22px] bg-white p-6.5 shadow-sm">{children}</div>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block last:mb-0">
      <span className="mb-2 flex flex-wrap items-baseline gap-2 text-[13px] font-semibold text-admin-muted-2">
        {label}
        {hint && <span className="text-xs font-normal text-admin-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function TriToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex h-[50px] gap-1 rounded-[14px] bg-admin-divider p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-[11px] text-[13.5px] font-semibold transition-colors",
            value === opt.value ? "bg-white text-foreground shadow-sm" : "text-admin-sidebar-subtle"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3.5 py-3.5">
      <div className="flex-1">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {hint && <div className="mt-0.5 text-[12.5px] leading-[1.6] text-admin-muted">{hint}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
          checked ? "bg-primary justify-end" : "bg-admin-divider justify-start"
        )}
      >
        <span className="size-5 rounded-full bg-white shadow" />
      </button>
    </div>
  );
}

function ContactNumberSelect({
  numbers,
  value,
  onChange,
  defaultLabel,
}: {
  numbers: ContactNumber[];
  value: string;
  onChange: (v: string) => void;
  defaultLabel: string;
}) {
  const items = useMemo(
    () => [{ value: "", label: defaultLabel }, ...numbers.map((n) => ({ value: n.id, label: `${n.label} · ${n.phoneE164}` }))],
    [numbers, defaultLabel]
  );
  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(v ?? "")}>
      <SelectTrigger className="admin-select-trigger"><SelectValue /></SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value || "default"} value={item.value}>{item.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
