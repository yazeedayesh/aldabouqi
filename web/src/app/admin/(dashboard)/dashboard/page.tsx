import { asc, desc, gte, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MessageCircle, Package, Sparkles, Tags } from "lucide-react";
import { getDb } from "@/db";
import { categories, inquiries, products } from "@/db/schema";
import { daysAgo } from "@/lib/utils";
import { ProductForm } from "../products/product-form";
import { DeleteProductButton } from "../products/delete-product-button";

const statusLabels: Record<string, string> = {
  available: "متوفر",
  reserved: "محجوز",
  sold: "مباع",
  draft: "مسودة",
};

export default async function AdminDashboardPage() {
  const db = getDb();
  const weekAgo = daysAgo(7);

  const [[{ count: totalProducts }], categoryRows, [{ count: inquiriesThisWeek }], recentProducts, recentInquiries] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(products),
      db.select().from(categories).orderBy(asc(categories.sortOrder)),
      db.select({ count: sql<number>`count(*)::int` }).from(inquiries).where(gte(inquiries.createdAt, weekAgo)),
      db.select().from(products).orderBy(desc(products.createdAt)).limit(5),
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(10),
    ]);

  const productCountsByCategory = await db
    .select({ category: products.category, count: sql<number>`count(*)::int` })
    .from(products)
    .groupBy(products.category);
  const countBySlug = new Map(productCountsByCategory.map((r) => [r.category, r.count]));

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">لوحة التحكم</h1>

      {/* Real numbers only — no invented "site visits" metric (brief §7.1). */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="إجمالي المنتجات" value={totalProducts} />
        <StatCard icon={Tags} label="الأقسام النشطة" value={categoryRows.length} />
        <StatCard icon={MessageCircle} label="طلبات واتساب هذا الأسبوع" value={inquiriesThisWeek} />
        <a
          href="https://analytics.google.com/analytics/web/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">زيارات الموقع</span>
            <ExternalLink className="size-4" />
          </div>
          <p className="mt-3 text-sm font-semibold text-primary">عرض تقرير Google Analytics</p>
        </a>
      </div>

      {/* AI photo-to-room feature — Phase 2, deliberately shipped disabled
          until the site owner explicitly approves the ongoing API cost.
          Tried activating it (2026-09-06): both Vercel AI Gateway and
          Google's direct API require real billing on file before serving
          any image-generation request — no free path exists for this
          specific capability. Site owner decided to defer, not pay yet. */}
      <div className="rounded-2xl border border-primary/20 bg-gold-tint p-5">
        <div className="flex items-center gap-2 text-foreground">
          <Sparkles className="size-5 text-primary" strokeWidth={1.7} />
          <h2 className="font-heading font-bold">تحويل صورة المنتج تلقائياً لغرفة منزلية حقيقية بالذكاء الاصطناعي</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          يحوّل صورة المنتج المرفوعة إلى معاينة داخل غرفة منزلية حقيقية قبل النشر. يحتاج تفعيله موافقة صريحة على تكلفة
          API مستمرة.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground opacity-70"
        >
          قريباً
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">إضافة منتج جديد</h2>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <ProductForm categories={categoryRows} />
          </div>
        </section>

        <div className="space-y-8">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">أحدث المنتجات</h2>
              <Link href="/admin/products" className="text-sm font-medium text-primary hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
              {recentProducts.length === 0 && <p className="p-5 text-sm text-muted-foreground">لا يوجد منتجات بعد</p>}
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 transition-colors hover:bg-secondary/30">
                  <Link href={`/admin/products/${product.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        width={44}
                        height={44}
                        className="size-11 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="size-11 rounded-lg bg-secondary" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{product.titleAr}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.price ? `${product.price} د.أ` : "عند المعاينة"} · {statusLabels[product.status]}
                      </p>
                    </div>
                  </Link>
                  <DeleteProductButton id={product.id} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-bold text-foreground">أحدث طلبات واتساب</h2>
            <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
              {recentInquiries.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">لا توجد استفسارات واتساب بعد</p>
              )}
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between gap-3 p-3">
                  <p className="truncate text-sm font-medium text-foreground">{inquiry.productTitleAr}</p>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleString("ar-JO", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">الأقسام</h2>
          <Link href="/admin/categories/new" className="text-sm font-medium text-primary hover:underline">
            + إضافة قسم
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryRows.map((cat) => (
            <Link
              key={cat.id}
              href={`/admin/categories/${cat.id}`}
              className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
            >
              <p className="font-medium text-foreground">{cat.nameAr}</p>
              <p className="mt-1 text-sm text-muted-foreground">{countBySlug.get(cat.slug) ?? 0} منتج</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" strokeWidth={1.7} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-3 font-heading text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
