import { and, asc, desc, eq } from "drizzle-orm";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";
import { PageHero } from "@/components/layout/page-hero";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export const revalidate = 300;

const content = {
  ar: {
    metaTitle: "المتجر | شركة الدابوقي لشراء وبيع الأثاث المستعمل",
    metaDescription: "تصفح قطع الأثاث المستعمل المتوفرة لدى الدابوقي حالياً في عمان — غرف نوم، صالونات، مكاتب، وأجهزة كهربائية بأسعار مناسبة.",
    pageTitle: "المتجر",
    priceOnRequest: "السعر عند المعاينة",
    empty: "لا يوجد منتجات متوفرة حالياً، تابعنا قريباً",
  },
  en: {
    metaTitle: "Store | Aldabouqi Used Furniture",
    metaDescription: "Browse the used furniture currently available from Aldabouqi in Amman — bedrooms, salons, offices, and appliances at fair prices.",
    pageTitle: "Store",
    priceOnRequest: "Price on request",
    empty: "No products available right now, check back soon",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/store">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: "/store", locale: locale as Locale });
}

export default async function StorePage({
  params,
  searchParams,
}: PageProps<"/[locale]/store">) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  const activeCategory = typeof category === "string" ? category : undefined;

  const categories = await getDb().select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder));
  const isValidCategory = categories.some((cat) => cat.slug === activeCategory);

  const rows = await getDb()
    .select()
    .from(products)
    .where(
      isValidCategory
        ? and(eq(products.status, "available"), eq(products.category, activeCategory as string))
        : eq(products.status, "available")
    )
    .orderBy(desc(products.createdAt));

  return (
    <>
      <PageHero title={c.pageTitle} crumbs={[{ href: "/store", label: c.pageTitle }]} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/store"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${!isValidCategory ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
          >
            {locale === "en" ? "All" : "الكل"}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/store?category=${cat.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${activeCategory === cat.slug ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
            >
              {locale === "en" ? cat.nameEn : cat.nameAr}
            </Link>
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{c.empty}</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((product) => (
              <Link
                key={product.id}
                href={`/store/${product.slug}`}
                className="group overflow-hidden rounded-2xl border border-border transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-4/3 bg-secondary/40">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={locale === "en" ? product.titleEn : product.titleAr}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary">
                    {locale === "en" ? product.titleEn : product.titleAr}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {product.price ? `${product.price} ${locale === "en" ? "JOD" : "د.أ"}` : c.priceOnRequest}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
