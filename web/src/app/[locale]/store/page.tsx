import { asc, desc, eq } from "drizzle-orm";
import { setRequestLocale } from "next-intl/server";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";
import { PageHero } from "@/components/layout/page-hero";
import { StoreGridSection } from "@/components/store/store-grid-section";
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
    noPhotoYet: "الصورة قيد الإضافة",
    shopByCategory: "تسوّق حسب الفئة",
    all: "الكل",
  },
  en: {
    metaTitle: "Store | Aldabouqi Used Furniture",
    metaDescription: "Browse the used furniture currently available from Aldabouqi in Amman — bedrooms, salons, offices, and appliances at fair prices.",
    pageTitle: "Store",
    priceOnRequest: "Price on request",
    empty: "No products available right now, check back soon",
    noPhotoYet: "Photo coming soon",
    shopByCategory: "Shop by Category",
    all: "All",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/store">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: "/store", locale: locale as Locale });
}

export default async function StorePage({ params }: PageProps<"/[locale]/store">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  const categories = await getDb().select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder));
  const rows = await getDb()
    .select()
    .from(products)
    .where(eq(products.status, "available"))
    .orderBy(desc(products.createdAt));

  return (
    <>
      <PageHero title={c.pageTitle} crumbs={[{ href: "/store", label: c.pageTitle }]} />
      <StoreGridSection locale={locale as Locale} categories={categories} products={rows} content={c} />
    </>
  );
}
