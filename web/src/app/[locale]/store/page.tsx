import { and, asc, desc, eq } from "drizzle-orm";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";
import { PageHero } from "@/components/layout/page-hero";
import { ProductImagePlaceholder } from "@/components/store/product-image-placeholder";
import { getCategoryIcon } from "@/lib/category-icons";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export const revalidate = 300;

const conditionLabels = {
  ar: { excellent: "ممتازة", good: "جيدة", fair: "مقبولة" },
  en: { excellent: "Excellent", good: "Good", fair: "Fair" },
} as const;

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
        <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {c.shopByCategory}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <CategoryChip href="/store" active={!isValidCategory} label={c.all} />
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <CategoryChip
                key={cat.slug}
                href={`/store?category=${cat.slug}`}
                active={activeCategory === cat.slug}
                label={locale === "en" ? cat.nameEn : cat.nameAr}
                image={cat.image}
                icon={Icon}
              />
            );
          })}
        </div>

        {rows.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{c.empty}</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((product) => {
              const title = locale === "en" ? product.titleEn : product.titleAr;
              return (
                <Link
                  key={product.id}
                  href={`/store/${product.slug}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <ProductImagePlaceholder label={c.noPhotoYet} />
                    )}
                    <span className="absolute bottom-3 start-3 rounded-full bg-ink/90 px-3 py-1 text-xs font-semibold text-ink-foreground backdrop-blur-sm">
                      {product.price ? `${product.price} ${locale === "en" ? "JOD" : "د.أ"}` : c.priceOnRequest}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium text-primary">
                      {conditionLabels[locale as Locale][product.condition]}
                    </p>
                    <h3 className="mt-1 font-heading font-semibold text-foreground transition-colors group-hover:text-primary">
                      {title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function CategoryChip({
  href,
  active,
  label,
  image,
  icon: Icon,
}: {
  href: string;
  active: boolean;
  label: string;
  image?: string | null;
  icon?: (props: { className?: string }) => React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-full border py-1.5 ps-2 pe-4 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
          active ? "bg-primary/15" : "bg-secondary"
        )}
      >
        {image ? (
          <Image src={image} alt="" width={32} height={32} className="size-full object-cover" />
        ) : Icon ? (
          <Icon className="size-4" />
        ) : null}
      </span>
      {label}
    </Link>
  );
}
