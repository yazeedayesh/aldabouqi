import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";
import { PageHero } from "@/components/layout/page-hero";
import { StorePageContent } from "@/components/store/store-page-content";
import { FaqSection } from "@/components/sections/faq-section";
import { BreadcrumbJsonLd, FaqJsonLd, JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { categoryContent } from "@/lib/category-content";
import { getStoreData } from "@/lib/store-data";
import { parseStoreFilters } from "@/lib/store-query";
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
    priceOnRequest: "السعر عند التواصل",
    empty: "لا يوجد منتجات مطابقة لهذا الفلتر بهذا القسم حاليًا",
    noPhotoYet: "الصورة قيد الإضافة",
    categoriesTitle: "الأقسام",
    allCategories: "كل الأقسام",
    conditionTitle: "الحالة",
    priceTitle: "السعر (د.أ)",
    from: "من",
    to: "إلى",
    availabilityTitle: "التوفّر",
    availableOnly: "متوفّر الآن فقط",
    includeSold: "يشمل المباع",
    sellTitle: "عندك عفش للبيع؟",
    sellBody: "ابعتلنا صور القطع على واتساب ومنعطيك سعر عادل بسرعة.",
    sellCta: "أرسل صور أثاثك",
    filterButton: "فلترة",
    resultsPrefix: "عرض",
    resultsOf: "من",
    resultsUnit: "قطعة",
    sortLabel: "ترتيب حسب",
    sortOptions: [
      { value: "newest" as const, label: "الأحدث" },
      { value: "cheapest" as const, label: "الأرخص" },
      { value: "priciest" as const, label: "الأغلى" },
    ],
    storeLabel: "المتجر",
    faqTitle: "أسئلة شائعة",
  },
  en: {
    priceOnRequest: "Price on request",
    empty: "No products match this filter in this category right now",
    noPhotoYet: "Photo coming soon",
    categoriesTitle: "Categories",
    allCategories: "All Categories",
    conditionTitle: "Condition",
    priceTitle: "Price (JOD)",
    from: "From",
    to: "To",
    availabilityTitle: "Availability",
    availableOnly: "Available now only",
    includeSold: "Include sold",
    sellTitle: "Have furniture to sell?",
    sellBody: "Send us photos on WhatsApp and we'll give you a fair price fast.",
    sellCta: "Send Your Furniture Photos",
    filterButton: "Filter",
    resultsPrefix: "Showing",
    resultsOf: "of",
    resultsUnit: "items",
    sortLabel: "Sort by",
    sortOptions: [
      { value: "newest" as const, label: "Newest" },
      { value: "cheapest" as const, label: "Cheapest" },
      { value: "priciest" as const, label: "Most Expensive" },
    ],
    storeLabel: "Store",
    faqTitle: "Frequently Asked Questions",
  },
} as const;

const conditionLabels = {
  ar: { excellent: "ممتازة", good: "جيدة جدًا", fair: "جيدة" },
  en: { excellent: "Excellent", good: "Very Good", fair: "Good" },
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

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/[locale]/store/[category]">) {
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
  const loc = locale as Locale;
  const c = content[loc];
  const name = locale === "en" ? categoryRow.nameEn : categoryRow.nameAr;
  const extra = categoryContent[categoryRow.slug];
  const canonicalUrl = `${SITE_URL}${locale === "en" ? "/en" : ""}/store/${slug}`;

  const sp = await searchParams;
  const filters = parseStoreFilters(sp);
  const data = await getStoreData({ categorySlug: categoryRow.slug, filters });

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
              itemListElement: data.products.map((product, i) => ({
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
          categoryRow.image
            ? {
                src: categoryRow.image,
                alt:
                  locale === "en"
                    ? `Used ${name} for sale in Amman`
                    : `${name} مستعملة للبيع في عمّان`,
              }
            : undefined
        }
      />
      {extra && (
        <section className="mx-auto max-w-4xl px-4 pt-16 sm:px-6 lg:px-8">
          <p className="leading-relaxed text-muted-foreground">{locale === "en" ? extra.introEn : extra.introAr}</p>
        </section>
      )}
      <div className="py-14">
        <StorePageContent
          locale={loc}
          pathname={`/store/${slug}`}
          activeCategorySlug={categoryRow.slug}
          categories={data.categories.map((cat) => ({
            slug: cat.slug,
            name: loc === "en" ? cat.nameEn : cat.nameAr,
            count: cat.count,
          }))}
          products={data.products}
          totalCount={data.totalCount}
          allCategoriesCount={data.baseTotalCount}
          totalPages={data.totalPages}
          conditions={(["excellent", "good", "fair"] as const).map((value) => ({
            value,
            label: conditionLabels[loc][value],
            count: data.countByCondition.get(value) ?? 0,
          }))}
          filters={filters}
          priceBounds={data.priceBounds}
          content={c}
        />
      </div>
      {faq.length > 0 && <FaqSection title={c.faqTitle} items={faq} />}
    </>
  );
}
