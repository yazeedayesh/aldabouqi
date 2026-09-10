import { asc, desc, eq, gte, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MessageCircle, Package, Plus, Tags } from "lucide-react";
import { getDb } from "@/db";
import { categories, inquiries, products } from "@/db/schema";
import { daysAgo } from "@/lib/utils";
import { AdminPageHeader } from "../admin-page-header";

const statusBadge: Record<string, { label: string; className: string }> = {
  published: { label: "منشور", className: "bg-accent text-primary" },
  hidden: { label: "مخفي", className: "bg-admin-divider text-admin-muted" },
  draft: { label: "مسودة", className: "bg-admin-divider text-admin-muted" },
};

export default async function AdminDashboardPage() {
  const db = getDb();
  const weekAgo = daysAgo(7);

  const [[{ count: totalProducts }], [{ count: publishedProducts }], categoryRows, [{ count: inquiriesThisWeek }], recentProducts, recentInquiries] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(products),
      db.select({ count: sql<number>`count(*)::int` }).from(products).where(eq(products.visibility, "published")),
      db.select().from(categories).orderBy(asc(categories.sortOrder)),
      db.select({ count: sql<number>`count(*)::int` }).from(inquiries).where(gte(inquiries.createdAt, weekAgo)),
      db.select().from(products).orderBy(desc(products.createdAt)).limit(5),
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(10),
    ]);
  const hiddenProducts = totalProducts - publishedProducts;

  const productCountsByCategory = await db
    .select({ category: products.category, count: sql<number>`count(*)::int` })
    .from(products)
    .groupBy(products.category);
  const countBySlug = new Map(productCountsByCategory.map((r) => [r.category, r.count]));

  return (
    <div>
      <AdminPageHeader
        title="لوحة التحكم"
        subtitle="نظرة عامة على المتجر"
        actions={
          <Link
            href="/admin/products/new"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4.5 text-[13.5px] font-bold text-primary-foreground"
          >
            <Plus className="size-4" />
            أضف منتج
          </Link>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="إجمالي المنتجات" value={totalProducts} sub={`${publishedProducts} منشور · ${hiddenProducts} مخفي`} />
        <StatCard icon={Tags} label="الأقسام النشطة" value={categoryRows.length} sub="كلها فيها منتجات" />
        <StatCard icon={MessageCircle} label="طلبات واتساب" value={inquiriesThisWeek} sub="هذا الأسبوع" valueClassName="text-primary" />
        <div className="rounded-[22px] bg-white p-6">
          <p className="mb-3 text-[13px] font-semibold text-admin-muted">زيارات الموقع</p>
          <p className="mb-3.5 text-[13px] leading-[1.75] text-admin-muted">
            الأرقام الحقيقية بـGoogle Analytics — ما منعرض رقم تقديري هون.
          </p>
          <a
            href="https://analytics.google.com/analytics/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-bold text-ink-foreground"
          >
            <ExternalLink className="size-[15px]" />
            افتح تقرير GA4
          </a>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="rounded-[22px] bg-white p-6.5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-heading text-lg font-extrabold text-foreground">أحدث المنتجات</h2>
            <Link
              href="/admin/products/new"
              className="flex h-10 items-center gap-2 rounded-full bg-primary px-4.5 text-[13.5px] font-bold text-primary-foreground"
            >
              <Plus className="size-4" />
              أضف منتج
            </Link>
          </div>
          {recentProducts.length === 0 && <p className="py-6 text-sm text-admin-muted">لا يوجد منتجات بعد</p>}
          {recentProducts.map((product) => {
            const badge = statusBadge[product.visibility];
            return (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 border-t border-admin-divider py-3.5 first:border-t-0"
              >
                {product.images[0] ? (
                  <Image src={product.images[0].url} alt={product.images[0].alt} width={40} height={40} className="size-10 rounded-[10px] object-cover" />
                ) : (
                  <div className="size-10 rounded-[10px] bg-admin-divider" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-semibold text-foreground">{product.titleAr}</p>
                  <p className="text-[13px] text-admin-muted">{product.price ? `${product.price} د.أ` : "عند التواصل"}</p>
                </div>
                <span className={`flex h-[26px] shrink-0 items-center rounded-full px-2.5 text-xs font-bold ${badge.className}`}>
                  {badge.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="rounded-[22px] bg-white p-6.5">
          <h2 className="mb-1 font-heading text-lg font-extrabold text-foreground">أحدث طلبات واتساب</h2>
          <p className="mb-1 text-[12.5px] text-admin-muted">تُسجّل تلقائيًا عند الضغط على زر واتساب — بدون أي بيانات شخصية.</p>
          {recentInquiries.length === 0 && <p className="py-6 text-sm text-admin-muted">لا توجد استفسارات واتساب بعد</p>}
          {recentInquiries.map((inquiry) => (
            <div key={inquiry.id} className="flex items-center gap-3.5 border-t border-admin-divider py-3.5 first:border-t-0">
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-accent">
                <MessageCircle className="size-4 text-primary" strokeWidth={2} />
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{inquiry.productTitleAr}</p>
              <p className="shrink-0 text-[12.5px] text-admin-muted">
                {new Date(inquiry.createdAt).toLocaleString("ar-JO", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[22px] bg-white p-6.5">
        <h2 className="mb-4 font-heading text-lg font-extrabold text-foreground">المنتجات حسب القسم</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categoryRows.map((cat) => (
            <Link key={cat.id} href={`/admin/categories/${cat.id}`} className="rounded-2xl bg-[#F7F8F9] p-4">
              <p className="font-heading text-2xl font-black leading-none text-primary">{countBySlug.get(cat.slug) ?? 0}</p>
              <p className="mt-2 text-[12.5px] leading-tight text-admin-muted-2">{cat.nameAr}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  valueClassName,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: number;
  sub: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-[22px] bg-white p-6">
      <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-admin-muted">
        <Icon className="size-4" strokeWidth={1.7} />
        {label}
      </div>
      <p className={`font-heading text-4xl font-black leading-none tracking-tight ${valueClassName ?? "text-foreground"}`}>{value}</p>
      <p className="mt-2.5 text-[12.5px] text-admin-muted">{sub}</p>
    </div>
  );
}
