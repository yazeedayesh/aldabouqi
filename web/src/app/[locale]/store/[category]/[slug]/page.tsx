import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Phone, ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductWhatsAppCta } from "@/components/store/product-whatsapp-cta";
import { InterestToggleButton } from "@/components/store/interest-toggle-button";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, STORE_PHONE_E164 } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export const revalidate = 300;

const conditionLabels = {
  ar: { excellent: "ممتازة", good: "جيدة", fair: "مقبولة" },
  en: { excellent: "Excellent", good: "Good", fair: "Fair" },
} as const;

const statusLabels = {
  ar: { available: "متوفر", reserved: "محجوز", sold: "تم البيع", draft: "" },
  en: { available: "Available", reserved: "Reserved", sold: "Sold", draft: "" },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/store/[category]/[slug]">) {
  const { locale, category, slug } = await params;
  const [product] = await getDb().select().from(products).where(eq(products.slug, slug));
  if (!product || product.category !== category) return {};

  const title = locale === "en" ? product.titleEn : product.titleAr;
  const description = locale === "en" ? product.descriptionEn : product.descriptionAr;
  // Price appended only when known — "price on request" is never spelled out
  // in the <title> itself (brief §10.2).
  const pageTitle =
    product.price != null
      ? `${title} - ${product.price} ${locale === "en" ? "JOD" : "د.أ"} | ${BUSINESS.nameAr}`
      : `${title} | ${BUSINESS.nameAr}`;

  return buildMetadata({
    title: pageTitle,
    description,
    path: `/store/${category}/${slug}`,
    locale: locale as Locale,
    ogImage: product.images[0]?.url,
  });
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/[locale]/store/[category]/[slug]">) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);

  const [product] = await getDb().select().from(products).where(eq(products.slug, slug));
  // A product under the wrong category in the URL 404s instead of rendering
  // normally — letting it through would give every product two indexable
  // URLs (its real category and any other slug someone types), which is
  // duplicate content, not a convenience.
  if (!product || product.status === "draft" || product.category !== category) notFound();

  const [categoryRow] = await getDb().select().from(categoriesTable).where(eq(categoriesTable.slug, category));

  const title = locale === "en" ? product.titleEn : product.titleAr;
  const description = locale === "en" ? product.descriptionEn : product.descriptionAr;
  const categoryLabel = categoryRow ? (locale === "en" ? categoryRow.nameEn : categoryRow.nameAr) : category;
  const isAvailable = product.status === "available";
  const productPath = `/store/${category}/${slug}`;

  return (
    <>
      <ProductJsonLd
        name={title}
        description={description}
        images={product.images.map((img) => img.url)}
        price={product.price}
        status={product.status}
        path={productPath}
      />
      <BreadcrumbJsonLd
        items={[
          { name: locale === "en" ? "Store" : "المتجر", path: "/store" },
          { name: categoryLabel, path: `/store/${category}` },
          { name: title, path: productPath },
        ]}
      />
      <PageHero
        title={title}
        crumbs={[
          { href: "/store", label: locale === "en" ? "Store" : "المتجر" },
          { href: `/store/${category}`, label: categoryLabel },
          { href: productPath, label: title },
        ]}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ProductGallery
          images={product.images}
          title={title}
          noPhotoLabel={locale === "en" ? "Photo coming soon" : "الصورة قيد الإضافة"}
          categorySlug={product.category}
        />

        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
            {!isAvailable && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {statusLabels[locale as Locale][product.status]}
              </span>
            )}
            <InterestToggleButton
              slug={product.slug}
              categorySlug={product.category}
              titleAr={product.titleAr}
              titleEn={product.titleEn}
              locale={locale as "ar" | "en"}
              className="ms-auto"
            />
          </div>

          <p className="mt-4 text-2xl font-bold text-primary">
            {product.price
              ? `${product.price} ${locale === "en" ? "JOD" : "د.أ"}`
              : locale === "en"
                ? "Price on request"
                : "السعر عند التواصل"}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {(locale === "en" ? "Condition: " : "الحالة: ") + conditionLabels[locale as Locale][product.condition]}
          </p>

          <p className="mt-6 leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* WhatsApp is always the primary, most prominent CTA. Cash-on-delivery
                checkout only makes sense when a firm price exists — for
                "price on request" items it's hidden entirely and WhatsApp is
                the sole option (per site owner decision, 2026-09-05). */}
            <ProductWhatsAppCta
              productId={product.id}
              productTitleAr={product.titleAr}
              message={
                locale === "en"
                  ? `Hi, I'm interested in: ${title}`
                  : `مرحباً، بدي أستفسر عن: ${title}`
              }
              label={locale === "en" ? "Ask on WhatsApp" : "استفسار عبر واتساب"}
            />
            {/* Direct call, required alongside WhatsApp on every product page
                (brief §6.3). Plenty of buyers here would rather ring than
                type — losing that lead to a missing button is a real cost. */}
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-6 text-base"
              nativeButton={false}
              render={
                <a
                  href={`tel:${STORE_PHONE_E164}`}
                  aria-label={locale === "en" ? "Call now" : "اتصل الآن"}
                />
              }
            >
              <Phone className="size-5" strokeWidth={1.7} />
              {locale === "en" ? "Call now" : "اتصل الآن"}
            </Button>
            {isAvailable && product.price != null ? (
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={`/store/checkout?product=${product.slug}`} />}
              >
                <ShoppingCart className="size-3.5" />
                {locale === "en" ? "Order (Cash on Delivery)" : "اطلب الآن (دفع عند الاستلام)"}
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
