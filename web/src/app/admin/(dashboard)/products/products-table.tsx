"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildAdminProductQuery, type AdminProductFilters } from "@/lib/admin-products-query";
import type { Category, Product } from "@/db/schema";

const conditionLabels: Record<string, string> = { excellent: "ممتازة", good: "جيدة جدًا", fair: "جيدة" };
const visibilityLabels: Record<string, string> = { published: "منشور", hidden: "مخفي", draft: "مسودة" };
const visibilityBadge: Record<string, string> = {
  published: "bg-accent text-primary",
  hidden: "bg-admin-divider text-admin-muted",
  draft: "bg-admin-divider text-admin-muted",
};

export function ProductsTable({
  products,
  categories,
  inquiryCounts,
  filters,
  totalCount,
  totalPages,
}: {
  products: Product[];
  categories: Category[];
  inquiryCounts: Record<string, number>;
  filters: AdminProductFilters;
  totalCount: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState(filters.q ?? "");

  const categoryName = useMemo(() => new Map(categories.map((c) => [c.slug, c.nameAr])), [categories]);
  const allSelected = products.length > 0 && selected.size === products.length;

  function navigate(overrides: Partial<AdminProductFilters>) {
    const qs = buildAdminProductQuery(filters, overrides);
    router.push(`/admin/products${qs}`);
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkAction(action: "publish" | "hide" | "delete" | "move", category?: string) {
    if (action === "delete" && !confirm(`حذف ${selected.size} منتج؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    setBusy(true);
    await fetch("/api/admin/products/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids: Array.from(selected), ...(category ? { category } : {}) }),
    });
    setSelected(new Set());
    setBusy(false);
    router.refresh();
  }

  async function toggleVisibility(product: Product) {
    setBusy(true);
    const visibility = product.visibility === "published" ? "hidden" : "published";
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    });
    setBusy(false);
    router.refresh();
  }

  async function deleteOne(id: string) {
    if (!confirm("حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    setBusy(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ q: q || undefined });
          }}
          className="flex h-[50px] min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-5.5"
        >
          <Search className="size-[19px] shrink-0 text-admin-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث باسم المنتج أو الرابط…"
            className="min-w-0 flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-admin-faint"
          />
        </form>

        <select
          value={filters.category ?? ""}
          onChange={(e) => navigate({ category: e.target.value || undefined })}
          className="h-[50px] rounded-full bg-white px-5 text-sm font-semibold text-foreground outline-none"
        >
          <option value="">كل الأقسام</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.nameAr}</option>
          ))}
        </select>

        <select
          value={filters.visibility ?? ""}
          onChange={(e) => navigate({ visibility: (e.target.value || undefined) as AdminProductFilters["visibility"] })}
          className="h-[50px] rounded-full bg-white px-5 text-sm font-semibold text-foreground outline-none"
        >
          <option value="">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="hidden">مخفي</option>
          <option value="draft">مسودة</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => navigate({ sort: e.target.value as AdminProductFilters["sort"] })}
          className="h-[50px] rounded-full bg-white px-5 text-sm font-semibold text-foreground outline-none"
        >
          <option value="newest">الأحدث</option>
          <option value="cheapest">الأرخص</option>
          <option value="priciest">الأغلى</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="mb-3.5 flex h-15 items-center justify-between rounded-[18px] bg-ink px-3 ps-5.5">
          <span className="text-sm font-semibold text-ink-foreground">تم اختيار {selected.size} منتج</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => bulkAction("publish")}
              className="h-[38px] rounded-full bg-white/10 px-4 text-[13px] font-semibold text-ink-foreground"
            >
              نشر
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => bulkAction("hide")}
              className="h-[38px] rounded-full bg-white/10 px-4 text-[13px] font-semibold text-ink-foreground"
            >
              إخفاء
            </button>
            <select
              disabled={busy}
              defaultValue=""
              onChange={(e) => e.target.value && bulkAction("move", e.target.value)}
              className="h-[38px] rounded-full bg-white/10 px-4 text-[13px] font-semibold text-ink-foreground"
            >
              <option value="" disabled>نقل لقسم…</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug} className="text-foreground">{c.nameAr}</option>
              ))}
            </select>
            <button
              type="button"
              disabled={busy}
              onClick={() => bulkAction("delete")}
              className="h-[38px] rounded-full bg-admin-danger px-4 text-[13px] font-bold text-white"
            >
              حذف
            </button>
          </div>
        </div>
      )}

      <div className="rounded-[22px] bg-white p-6.5">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-4 text-admin-muted">لا يوجد منتجات مطابقة</p>
            <Link href="/admin/products/new" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">
              أضف منتج
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[880px]">
              <div className="grid grid-cols-[30px_50px_minmax(0,1fr)_120px_100px_90px_90px_70px_110px] items-center gap-3.5 pb-3 text-[12.5px] font-semibold text-admin-muted">
                <button type="button" onClick={toggleAll} aria-label="تحديد الكل" className={cn("size-5 rounded-[7px] border-[1.6px]", allSelected ? "border-primary bg-primary" : "border-admin-border")}>
                  {allSelected && <CheckMark />}
                </button>
                <div />
                <div>المنتج</div>
                <div>القسم</div>
                <div>السعر</div>
                <div>الحالة</div>
                <div>النشر</div>
                <div className="text-center">استفسارات</div>
                <div />
              </div>

              {products.map((product) => {
                const isSelected = selected.has(product.id);
                return (
                  <div
                    key={product.id}
                    className="grid grid-cols-[30px_50px_minmax(0,1fr)_120px_100px_90px_90px_70px_110px] items-center gap-3.5 border-t border-admin-divider py-3.5"
                  >
                    <button
                      type="button"
                      onClick={() => toggleOne(product.id)}
                      aria-label="تحديد"
                      className={cn("size-5 rounded-[7px] border-[1.6px]", isSelected ? "border-primary bg-primary" : "border-admin-border")}
                    >
                      {isSelected && <CheckMark />}
                    </button>
                    {product.images[0] ? (
                      <Image src={product.images[0].url} alt={product.images[0].alt} width={50} height={50} className="size-[50px] rounded-[12px] object-cover" />
                    ) : (
                      <div className="size-[50px] rounded-[12px] bg-admin-divider" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[14.5px] font-semibold text-foreground">{product.titleAr}</p>
                      <p dir="ltr" className="truncate text-end font-mono text-[11.5px] text-admin-faint">/store/{product.category}/{product.slug}</p>
                    </div>
                    <div className="truncate text-[13.5px] text-admin-muted-2">{categoryName.get(product.category) ?? product.category}</div>
                    <div className="font-heading text-[14.5px] font-extrabold text-foreground">{product.price ? `${product.price} د.أ` : "—"}</div>
                    <div className="text-[13px] text-admin-muted-2">{conditionLabels[product.condition]}</div>
                    <div>
                      <span className={cn("flex h-[26px] w-fit items-center rounded-full px-2.5 text-xs font-bold", visibilityBadge[product.visibility])}>
                        {visibilityLabels[product.visibility]}
                      </span>
                    </div>
                    <div className="text-center text-[13.5px] text-admin-muted-2">{inquiryCounts[product.id] ?? 0}</div>
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/admin/products/${product.id}`} title="تعديل" className="flex size-[34px] items-center justify-center rounded-[11px] bg-admin-input text-admin-muted-2">
                        <Pencil className="size-4" />
                      </Link>
                      <button type="button" onClick={() => toggleVisibility(product)} disabled={busy} title={product.visibility === "published" ? "إخفاء" : "نشر"} className="flex size-[34px] items-center justify-center rounded-[11px] bg-admin-input text-admin-muted-2">
                        {product.visibility === "published" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                      <button type="button" onClick={() => deleteOne(product.id)} disabled={busy} title="حذف" className="flex size-[34px] items-center justify-center rounded-[11px] bg-admin-danger-bg text-admin-danger">
                        {busy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[13.5px] text-admin-muted">
            عرض {(filters.page - 1) * 20 + 1}–{Math.min(filters.page * 20, totalCount)} من {totalCount} منتج
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={filters.page <= 1}
              onClick={() => startTransition(() => navigate({ page: filters.page - 1 }))}
              className="flex size-10 items-center justify-center rounded-[13px] bg-white text-admin-muted disabled:opacity-40"
            >
              <ChevronRight className="size-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => navigate({ page: p })}
                className={cn(
                  "flex size-10 items-center justify-center rounded-[13px] text-sm font-semibold",
                  p === filters.page ? "bg-primary text-primary-foreground" : "bg-white text-admin-muted-2"
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={filters.page >= totalPages}
              onClick={() => startTransition(() => navigate({ page: filters.page + 1 }))}
              className="flex size-10 items-center justify-center rounded-[13px] bg-white text-admin-muted disabled:opacity-40"
            >
              <ChevronLeft className="size-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
