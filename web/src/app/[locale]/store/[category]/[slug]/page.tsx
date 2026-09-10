import { and, desc, eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Phone, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDb } from "@/db";
import { categories as categoriesTable, contactNumbers, products } from "@/db/schema";
import { getDefaultContactNumber } from "@/lib/business";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductWhatsAppCta } from "@/components/store/product-whatsapp-cta";
import { InterestToggleButton } from "@/components/store/interest-toggle-button";
import { ProductCard } from "@/components/store/product-card";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, STORE_PHONE_E164 } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export const revalidate = 300;

// Labels match the redesigned store's condition taxonomy (site owner
// follow-up, 2026-09-07) — DB values (excellent/good/fair) are unchanged,
// only the Arabic display labels for "good" and "fair" moved.
const conditionLabels = {
  ar: { excellent: "ممتازة", good: "جيدة جدًا", fair: "جيدة" },
  en: { excellent: "Excellent", good: "Very Good", fair: "Good" },
} as const;

// The "شو يعني" explainer box's main paragraph switches with the current
// product's condition; the other two conditions get their one-line
// versions listed underneath. Every sentence here is the reference
// mockup's own text (verbatim for "excellent"; the other two conditions
// only had one-line versions in the mockup, reused as-is rather than
// invented longer paragraphs — flagged to the site owner).
const conditionExplainer = {
  ar: {
    excellent: "القطعة قريبة جدًا من الجديدة — بدون خدوش واضحة ولا بقع، الهيكل ثابت ١٠٠٪، والاستخدام كان خفيف أو لفترة قصيرة.",
    good: "استخدام طبيعي بعناية، خدش بسيط غير ملفت.",
    fair: "آثار استخدام واضحة، سليمة هيكليًا وبسعر أقل.",
  },
  en: {
    excellent: "This piece is very close to new — no visible scratches or stains, the frame is 100% solid, and it saw light use for a short period.",
    good: "Used carefully in everyday life, with a minor scratch that isn't noticeable.",
    fair: "Clear signs of use, but structurally sound and priced lower.",
  },
} as const;

const statusDot = {
  available: "#25d366",
  reserved: "var(--muted-foreground)",
  sold: "",
  // "draft" is still a valid Postgres value on this column for backward
  // compatibility (see schema.ts) even though the app never writes it here
  // anymore — this entry only exists to satisfy the type, never renders.
  draft: "",
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
  const loc = locale as Locale;

  const [product] = await getDb().select().from(products).where(eq(products.slug, slug));
  // A product under the wrong category in the URL 404s instead of rendering
  // normally — letting it through would give every product two indexable
  // URLs (its real category and any other slug someone types), which is
  // duplicate content, not a convenience. A "draft" product 404s too
  // ("ما انعرض أبدًا") but "hidden" deliberately does NOT — its direct URL
  // keeps working, it's just excluded from listings (admin v2 brief,
  // 2026-09-08: "بتضل موجودة وما بتنكسر روابطها").
  if (!product || product.visibility === "draft" || product.category !== category) notFound();

  const [categoryRow, relatedProducts, whatsappNumber, callNumber, defaultNumber] = await Promise.all([
    getDb().select().from(categoriesTable).where(eq(categoriesTable.slug, category)).then((r) => r[0]),
    getDb()
      .select()
      .from(products)
      .where(
        and(
          eq(products.category, category),
          eq(products.status, "available"),
          eq(products.visibility, "published"),
          ne(products.id, product.id)
        )
      )
      .orderBy(desc(products.createdAt))
      .limit(4),
    product.whatsappContactNumberId
      ? getDb().select().from(contactNumbers).where(eq(contactNumbers.id, product.whatsappContactNumberId)).then((r) => r[0])
      : Promise.resolve(undefined),
    product.callContactNumberId
      ? getDb().select().from(contactNumbers).where(eq(contactNumbers.id, product.callContactNumberId)).then((r) => r[0])
      : Promise.resolve(undefined),
    getDefaultContactNumber(),
  ]);

  // Resolution order matches the admin form's own stated fallback chain:
  // WhatsApp -> its own override, else the site default. Call -> its own
  // override, else "same number as WhatsApp" (per the product form's
  // placeholder text), else the site default.
  const resolvedWhatsapp = whatsappNumber?.phoneE164 ?? defaultNumber?.phoneE164 ?? BUSINESS.phoneE164;
  const resolvedCall = callNumber?.phoneE164 ?? whatsappNumber?.phoneE164 ?? defaultNumber?.phoneE164 ?? STORE_PHONE_E164;

  const title = loc === "en" ? product.titleEn : product.titleAr;
  const description = loc === "en" ? product.descriptionEn : product.descriptionAr;
  const categoryLabel = categoryRow ? (loc === "en" ? categoryRow.nameEn : categoryRow.nameAr) : category;
  const isAvailable = product.status === "available";
  const isSold = product.status === "sold";
  const productPath = `/store/${category}/${slug}`;

  const content = {
    ar: {
      storeLabel: "المتجر",
      priceOnRequest: "السعر عند التواصل",
      negotiable: "السعر قابل للتفاوض",
      availableNow: "متوفّرة الآن",
      reserved: "محجوزة",
      sold: "تم البيع",
      whatsappCta: "استفسر عبر واتساب",
      call: "اتصل الآن",
      cod: "اطلبها بالدفع عند الاستلام",
      trust1: "معاينة مجانية قبل الشراء",
      trust2: "توصيل لجميع مناطق عمّان",
      trust3: "نرد على واتساب ٢٤/٧",
      specsTitle: "المواصفات",
      explainerTitle: `شو يعني «${conditionLabels.ar[product.condition]}»؟`,
      zoomHint: "اضغط للتكبير",
      noPhotoYet: "الصورة قيد الإضافة",
      relatedTitle: "قطع مشابهة",
      relatedCta: `كل ${categoryLabel}`,
    },
    en: {
      storeLabel: "Store",
      priceOnRequest: "Price on request",
      negotiable: "Price is negotiable",
      availableNow: "Available now",
      reserved: "Reserved",
      sold: "Sold",
      whatsappCta: "Ask on WhatsApp",
      call: "Call now",
      cod: "Order (Cash on Delivery)",
      trust1: "Free preview before you buy",
      trust2: "Delivery across Amman",
      trust3: "We reply on WhatsApp 24/7",
      specsTitle: "Specifications",
      explainerTitle: `What does "${conditionLabels.en[product.condition]}" mean?`,
      zoomHint: "Click to zoom",
      noPhotoYet: "Photo coming soon",
      relatedTitle: "Similar items",
      relatedCta: `All ${categoryLabel}`,
    },
  }[loc];

  const otherConditions = (["excellent", "good", "fair"] as const).filter((c) => c !== product.condition);

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
          { name: content.storeLabel, path: "/store" },
          { name: categoryLabel, path: `/store/${category}` },
          { name: title, path: productPath },
        ]}
      />
      <PageHero
        title={title}
        crumbs={[
          { href: "/store", label: content.storeLabel },
          { href: `/store/${category}`, label: categoryLabel },
          { href: productPath, label: title },
        ]}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-6 pb-0 sm:px-6 lg:grid-cols-[minmax(0,1fr)_452px] lg:px-12">
        <ProductGallery
          images={product.images}
          title={title}
          conditionLabel={conditionLabels[loc][product.condition]}
          zoomHint={content.zoomHint}
          noPhotoLabel={content.noPhotoYet}
          categorySlug={product.category}
        />

        <div className="flex flex-col gap-3.5">
          <div className="rounded-[22px] border border-border bg-card p-6 lg:p-[26px]">
            <p className="mb-2 text-[13px] font-semibold text-primary">{categoryLabel}</p>
            <h1 className="font-heading mb-3.5 text-2xl leading-snug font-black lg:text-[28px]">{title}</h1>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="flex h-[30px] items-center rounded-full bg-accent px-3 text-[12.5px] font-bold text-primary-dark">
                {conditionLabels[loc][product.condition]}
              </span>
              <span className="flex h-[30px] items-center gap-1.5 rounded-full border border-border px-3 text-[12.5px] font-semibold text-muted-foreground">
                {!isSold && (
                  <span className="size-[7px] rounded-full" style={{ background: statusDot[product.status] || "var(--muted-foreground)" }} />
                )}
                {isSold ? content.sold : product.status === "reserved" ? content.reserved : content.availableNow}
              </span>
            </div>

            <div className="mb-5 flex items-baseline gap-2 border-b border-border pb-5">
              {product.price ? (
                <>
                  <span className="font-heading text-4xl font-black text-primary lg:text-[40px]">{product.price}</span>
                  <span className="text-base font-semibold text-muted-foreground">{loc === "en" ? "JOD" : "د.أ"}</span>
                  {product.negotiable && (
                    <span className="ms-auto text-[12.5px] text-muted-foreground">{content.negotiable}</span>
                  )}
                </>
              ) : (
                <span className="font-heading text-2xl font-black text-primary-dark">{content.priceOnRequest}</span>
              )}
            </div>

            <p className="mb-5 leading-[1.85] text-[14.5px] text-muted-foreground">{description}</p>

            {/* Inline CTA row is desktop-only — mobile gets a fixed bottom
                action bar instead (site owner rule, 2026-09-07), matching
                the reference's mobile layout which has no inline CTAs at
                all in the details flow. */}
            <div className="hidden flex-col gap-2.5 lg:flex">
              <ProductWhatsAppCta
                productId={product.id}
                productTitleAr={product.titleAr}
                message={loc === "en" ? `Hi, I'm interested in: ${title}` : `مرحباً، بدي أستفسر عن: ${title}`}
                label={content.whatsappCta}
                whatsappPhoneE164={resolvedWhatsapp}
                className="h-[54px] w-full text-[16.5px] font-extrabold"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-[1.5px] border-ink text-[14.5px] font-bold"
                  nativeButton={false}
                  render={<a href={`tel:${resolvedCall}`} aria-label={content.call} />}
                >
                  <Phone className="size-[18px]" strokeWidth={1.7} />
                  {content.call}
                </Button>
                <InterestToggleButton
                  variant="button"
                  slug={product.slug}
                  categorySlug={product.category}
                  titleAr={product.titleAr}
                  titleEn={product.titleEn}
                  locale={loc}
                />
              </div>
              {isAvailable && product.price != null && (
                <Button
                  size="lg"
                  className="h-11 w-full rounded-full bg-accent text-sm font-semibold text-muted-foreground hover:bg-accent/80"
                  nativeButton={false}
                  render={<Link href={`/store/checkout?product=${product.slug}`} />}
                >
                  <ShoppingCart className="size-4" strokeWidth={1.7} />
                  {content.cod}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[15px] rounded-[22px] border border-border bg-card px-6 py-5">
            <TrustRow icon={<ShieldCheck className="size-[21px]" strokeWidth={1.6} />} label={content.trust1} />
            <TrustRow icon={<Truck className="size-[21px]" strokeWidth={1.6} />} label={content.trust2} />
            <TrustRow icon={<Phone className="size-[21px]" strokeWidth={1.6} />} label={content.trust3} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-0 sm:px-6 lg:grid-cols-[minmax(0,1fr)_452px] lg:px-12">
          {product.specs.length > 0 && (
            <div className="rounded-[22px] border border-border bg-card p-7 lg:p-[30px]">
              <p className="font-heading mb-5 text-[19px] font-extrabold">{content.specsTitle}</p>
              <div className="flex flex-col">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-border py-3.5 text-[14.5px] last:border-0"
                  >
                    <span className="text-muted-foreground">{loc === "en" ? spec.labelEn : spec.labelAr}</span>
                    <span className="font-semibold">{loc === "en" ? spec.valueEn : spec.valueAr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={product.specs.length > 0 ? "rounded-[22px] bg-accent p-[26px] lg:p-7" : "rounded-[22px] bg-accent p-[26px] lg:col-start-2 lg:p-7"}>
            <p className="font-heading mb-2 text-[17px] font-extrabold">{content.explainerTitle}</p>
            <p className="mb-[18px] text-sm leading-[1.8] text-muted-foreground">
              {conditionExplainer[loc][product.condition]}
            </p>
            <div className="flex flex-col gap-2.5 text-[13.5px] text-muted-foreground">
              {otherConditions.map((c) => (
                <div key={c} className="flex gap-2.5">
                  <span className="min-w-[74px] font-bold text-primary-dark">{conditionLabels[loc][c]}</span>
                  <span>{conditionExplainer[loc][c]}</span>
                </div>
              ))}
            </div>
          </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-11 pb-14 sm:px-6 lg:px-12">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-heading text-2xl font-black">{content.relatedTitle}</p>
            <Button
              variant="outline"
              className="h-10 rounded-full border-[1.5px] border-ink px-[18px] text-sm font-bold"
              nativeButton={false}
              render={<Link href={`/store/${category}`} />}
            >
              {content.relatedCta}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={categoryLabel}
                locale={loc}
                noPhotoLabel={content.noPhotoYet}
                priceOnRequestLabel={content.priceOnRequest}
                callPhoneE164={defaultNumber?.phoneE164 ?? STORE_PHONE_E164}
              />
            ))}
          </div>
        </section>
      )}

      {/* Fixed bottom action bar, mobile only — the reference's mobile
          layout has no inline CTAs in the details flow at all, just this
          bar. The spacer div keeps it from covering the last bit of page
          content underneath it. */}
      <div className="h-[84px] lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-border bg-background px-4 py-3 lg:hidden">
        <ProductWhatsAppCta
          productId={product.id}
          productTitleAr={product.titleAr}
          message={loc === "en" ? `Hi, I'm interested in: ${title}` : `مرحباً، بدي أستفسر عن: ${title}`}
          label={content.whatsappCta}
          whatsappPhoneE164={resolvedWhatsapp}
          className="h-[54px] flex-1 text-base font-extrabold"
        />
        <a
          href={`tel:${resolvedCall}`}
          aria-label={content.call}
          className="flex size-[54px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink"
        >
          <Phone className="size-[21px]" strokeWidth={1.7} />
        </a>
      </div>
    </>
  );
}

function TrustRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
