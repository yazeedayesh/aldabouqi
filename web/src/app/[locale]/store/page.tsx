import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { StorePageContent } from "@/components/store/store-page-content";
import { buildMetadata } from "@/lib/seo";
import { getStoreData } from "@/lib/store-data";
import { parseStoreFilters } from "@/lib/store-query";
import type { Locale } from "@/i18n/routing";

export const revalidate = 300;

const content = {
  ar: {
    metaTitle: "المتجر | شركة الدابوقي لشراء وبيع الأثاث المستعمل",
    metaDescription: "تصفح قطع الأثاث المستعمل المتوفرة لدى الدابوقي حالياً في عمان — غرف نوم، صالونات، مكاتب، وأجهزة كهربائية بأسعار مناسبة.",
    pageTitle: "المتجر",
    heroSubtitle: "قطع مفحوصة ومصنّفة حسب الحالة، بأسعار واضحة. تواصل معنا على واتساب لأي استفسار أو لترتيب المعاينة والتوصيل.",
    priceOnRequest: "السعر عند التواصل",
    empty: "لا يوجد منتجات مطابقة لهذا الفلتر حالياً",
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
  },
  en: {
    metaTitle: "Store | Aldabouqi Used Furniture",
    metaDescription: "Browse the used furniture currently available from Aldabouqi in Amman — bedrooms, salons, offices, and appliances at fair prices.",
    pageTitle: "Store",
    heroSubtitle: "Inspected pieces, graded by condition, with clear prices. Message us on WhatsApp for any question or to arrange a viewing and delivery.",
    priceOnRequest: "Price on request",
    empty: "No products match this filter right now",
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
  },
} as const;

const conditionLabels = {
  ar: { excellent: "ممتازة", good: "جيدة جدًا", fair: "جيدة" },
  en: { excellent: "Excellent", good: "Very Good", fair: "Good" },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/store">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: "/store", locale: locale as Locale });
}

export default async function StorePage({ params, searchParams }: PageProps<"/[locale]/store">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc];

  const sp = await searchParams;
  const filters = parseStoreFilters(sp);
  const data = await getStoreData({ filters });

  return (
    <>
      <PageHero title={c.pageTitle} crumbs={[{ href: "/store", label: c.pageTitle }]} />
      <p className="mx-auto -mt-4 mb-2 max-w-2xl px-4 text-[15px] leading-relaxed text-muted-foreground sm:px-6 lg:px-12">
        {c.heroSubtitle}
      </p>
      <div className="pb-14">
        <StorePageContent
          locale={loc}
          pathname="/store"
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
    </>
  );
}
