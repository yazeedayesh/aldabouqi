import { and, asc, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";
import { PageHero } from "@/components/layout/page-hero";
import { StoreGridSection } from "@/components/store/store-grid-section";
import { FaqSection } from "@/components/sections/faq-section";
import { BreadcrumbJsonLd, FaqJsonLd, JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { categoryContent } from "@/lib/category-content";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export const revalidate = 300;

/**
 * Real indexed category landing page — /store/{category} — replacing
 * /store?category={slug} as the canonical, rankable URL for each of the 8
 * categories (site-owner follow-up, 2026-09-05: "8 صفحات هبوط قابلة
 * للترتيب"). /store itself still shows everything with chips linking here.
 *
 * This single dynamic segment does double duty: if the URL value is a real
 * category slug, this renders the category listing. If it isn't, it falls
 * back to the legacy behavior this route used to have exclusively — a
 * product used to live at /store/{slug} (one segment) before moving to
 * /store/{category}/{slug}; a non-category value here is looked up as that
 * old product slug and permanently redirected into its real path. Neither
 * lookup matching means the URL is genuinely nothing → 404. The folder is
 * named [category] (not [slug]) because Next.js requires sibling dynamic
 * segments at the same tree position — this route and .../[category]/
 * [slug] below it — to share one param name.
 */

const content = {
  ar: {
    priceOnRequest: "السعر عند المعاينة",
    empty: "لا يوجد منتجات بهذا القسم حالياً، تابعنا قريباً",
    noPhotoYet: "الصورة قيد الإضافة",
    shopByCategory: "تسوّق حسب الفئة",
    all: "الكل",
    storeLabel: "المتجر",
    faqTitle: "أسئلة شائعة",
  },
  en: {
    priceOnRequest: "Price on request",
    empty: "No products in this category right now, check back soon",
    noPhotoYet: "Photo coming soon",
    shopByCategory: "Shop by Category",
    all: "All",
    storeLabel: "Store",
    faqTitle: "Frequently Asked Questions",
  },
} as const;

export async function generateStaticParams() {
  const rows = await getDb().select({ slug: categoriesTable.slug }).from(categoriesTable);
  return rows.map((row) => ({ category: row.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/store/[category]">) {
  const { locale, category: slug } = await params;
  const [categoryRow] = await getDb().select().from(categoriesTable).where(eq(categoriesTable.slug, slug));
  if (!categoryRow) return {};

  const name = locale === "en" ? categoryRow.nameEn : categoryRow.nameAr;
  const title =
    locale === "en"
      ? `Used ${name} for Sale | Store - Aldabouqi Used Furniture`
      : `${name} مستعملة للبيع | المتجر - شركة الدابوقي`;
  const description =
    locale === "en"
      ? `Browse used ${name.toLowerCase()} currently available from Aldabouqi in Amman at fair prices, with delivery across Jordan.`
      : `تصفح ${name} المستعملة المتوفرة لدى الدابوقي حالياً في عمان بأسعار مناسبة، مع توصيل لجميع مناطق الأردن.`;

  return buildMetadata({ title, description, path: `/store/${slug}`, locale: locale as Locale });
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/store/[category]">) {
  const { locale, category: slug } = await params;

  const [categoryRow] = await getDb().select().from(categoriesTable).where(eq(categoriesTable.slug, slug));

  if (!categoryRow) {
    // Not a category — check whether this is an old-shaped product URL
    // (/store/{slug}, pre-brief-§10.1) and redirect it into its real path.
    const [product] = await getDb().select().from(products).where(eq(products.slug, slug));
    if (product) {
      permanentRedirect({ href: `/store/${product.category}/${product.slug}`, locale });
    }
    notFound();
  }

  setRequestLocale(locale);
  const c = content[locale as Locale];
  const name = locale === "en" ? categoryRow.nameEn : categoryRow.nameAr;
  const extra = categoryContent[categoryRow.slug];
  const canonicalUrl = `${SITE_URL}${locale === "en" ? "/en" : ""}/store/${slug}`;

  const [allCategories, rows] = await Promise.all([
    getDb().select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder)),
    getDb()
      .select()
      .from(products)
      .where(and(eq(products.status, "available"), eq(products.category, categoryRow.slug)))
      .orderBy(desc(products.createdAt)),
  ]);

  const faq = extra ? (locale === "en" ? extra.faqEn : extra.faqAr) : [];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: c.storeLabel, path: "/store" },
          { name, path: `/store/${slug}` },
        ]}
      />
      {extra && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name,
            url: canonicalUrl,
            description: locale === "en" ? extra.introEn : extra.introAr,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: rows.map((product, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}${locale === "en" ? "/en" : ""}/store/${categoryRow.slug}/${product.slug}`,
                name: locale === "en" ? product.titleEn : product.titleAr,
              })),
            },
          }}
        />
      )}
      {faq.length > 0 && <FaqJsonLd items={faq} />}
      <PageHero
        title={name}
        crumbs={[
          { href: "/store", label: c.storeLabel },
          { href: `/store/${slug}`, label: name },
        ]}
        image={
          extra?.heroImage
            ? { src: extra.heroImage.src, alt: locale === "en" ? extra.heroImage.altEn : extra.heroImage.altAr }
            : undefined
        }
      />
      {extra && (
        <section className="mx-auto max-w-4xl px-4 pt-16 sm:px-6 lg:px-8">
          <p className="leading-relaxed text-muted-foreground">{locale === "en" ? extra.introEn : extra.introAr}</p>
        </section>
      )}
      <StoreGridSection
        locale={locale as Locale}
        categories={allCategories}
        activeCategorySlug={categoryRow.slug}
        products={rows}
        content={c}
      />
      {faq.length > 0 && <FaqSection title={c.faqTitle} items={faq} />}
    </>
  );
}
