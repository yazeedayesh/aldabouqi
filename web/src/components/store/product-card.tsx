import Image from "next/image";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProductImagePlaceholder } from "@/components/store/product-image-placeholder";
import { InterestToggleButton } from "@/components/store/interest-toggle-button";
import { ProductWhatsAppCta } from "@/components/store/product-whatsapp-cta";
import { Reveal } from "@/components/ui/reveal";
import { STORE_PHONE_E164 } from "@/lib/constants";
import type { Product } from "@/db/schema";

// Labels match the redesigned store's condition taxonomy (site owner
// follow-up, 2026-09-07) — DB values (excellent/good/fair) are unchanged,
// only the Arabic display labels for "good" and "fair" moved.
const conditionLabels = {
  ar: { excellent: "ممتازة", good: "جيدة جدًا", fair: "جيدة" },
  en: { excellent: "Excellent", good: "Very Good", fair: "Good" },
} as const;

const content = {
  ar: { call: "اتصل الآن", whatsapp: "استفسر", sold: "تم البيع" },
  en: { call: "Call now", whatsapp: "Inquire", sold: "Sold" },
} as const;

/**
 * The one product card used everywhere a product is listed — /store,
 * /store/[category], the homepage's featured-products section, and
 * "related products" — so there's a single place to change how a listing
 * looks (site owner follow-up, 2026-09-05: "استخدم نفس مكوّن بطاقة
 * المنتج، لا تكرر كود"). Redesigned 2026-09-07 to match the approved
 * store/product mockup: 4:3 image on desktop (square on mobile), hover-
 * reveal WhatsApp/call actions on desktop only (never hidden behind hover
 * on touch screens — removed from the card entirely below lg instead),
 * and a distinct faded/struck-through "sold" presentation.
 *
 * Two separate <Link>s (image area + text area) instead of one link
 * wrapping the whole card — the hover-action row needs a real <a> (the
 * WhatsApp CTA) and a real <a> (tel: call), and nesting anchors inside an
 * outer anchor is invalid HTML that Next.js's Server Component rules
 * reject outright ("Event handlers cannot be passed to Client Component
 * props") the moment one of them needs an onClick. The image link is
 * aria-hidden so the card's accessible name isn't announced twice.
 */
export function ProductCard({
  product,
  categoryName,
  locale,
  delayMs = 0,
  noPhotoLabel,
  priceOnRequestLabel,
}: {
  product: Product;
  /** Display name of product.category, resolved by the caller (which already has the category list in hand). */
  categoryName: string;
  locale: "ar" | "en";
  delayMs?: number;
  noPhotoLabel: string;
  priceOnRequestLabel: string;
}) {
  const title = locale === "en" ? product.titleEn : product.titleAr;
  const c = content[locale];
  const isSold = product.status === "sold";
  const primaryImage = product.images.find((img) => img.order === 0) ?? product.images[0];
  const href = `/store/${product.category}/${product.slug}` as const;

  return (
    <Reveal delayMs={delayMs}>
      <div className="group relative overflow-hidden rounded-[16px] border border-border bg-card transition-all lg:rounded-2xl lg:hover:-translate-y-1 lg:hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-secondary lg:aspect-4/3">
          <Link href={href} aria-hidden tabIndex={-1} className="absolute inset-0 z-0">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || title}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 lg:group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
            ) : (
              <ProductImagePlaceholder label={noPhotoLabel} categorySlug={product.category} />
            )}
          </Link>

          {isSold && <div className="pointer-events-none absolute inset-0 bg-background/68" />}

          <span
            className={
              isSold
                ? "pointer-events-none absolute top-2.5 start-2.5 flex h-[26px] items-center rounded-full bg-ink px-3 text-[11.5px] font-bold text-ink-foreground lg:top-3 lg:start-3"
                : "pointer-events-none absolute top-2.5 start-2.5 flex h-[23px] items-center rounded-full border border-border bg-card px-2.5 text-[10.5px] font-bold lg:top-3 lg:start-3 lg:h-[26px] lg:px-[11px] lg:text-[11.5px]"
            }
          >
            {isSold ? c.sold : conditionLabels[locale][product.condition]}
          </span>

          {!isSold && (
            <InterestToggleButton
              slug={product.slug}
              categorySlug={product.category}
              titleAr={product.titleAr}
              titleEn={product.titleEn}
              locale={locale}
              className="absolute end-2 top-2 z-10 size-[30px] bg-card/90 lg:end-3 lg:top-3 lg:size-8"
            />
          )}

          {!isSold && (
            <div className="absolute start-3 end-3 bottom-3 z-10 hidden items-center gap-2 opacity-0 transition-opacity lg:flex lg:group-hover:opacity-100">
              <ProductWhatsAppCta
                compact
                productId={product.id}
                productTitleAr={product.titleAr}
                message={
                  locale === "en"
                    ? `Hi, I'm interested in: ${title}`
                    : `مرحباً، بدي أستفسر عن: ${title}`
                }
                label={c.whatsapp}
              />
              <a
                href={`tel:${STORE_PHONE_E164}`}
                aria-label={c.call}
                className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-ink text-ink-foreground transition-transform hover:scale-105"
              >
                <Phone className="size-4" strokeWidth={1.7} />
              </a>
            </div>
          )}
        </div>
        <Link href={href} className={isSold ? "block p-4 opacity-[.62]" : "block p-4"}>
          <p className="mb-1 text-xs text-muted-foreground">{categoryName}</p>
          <h3 className="font-heading text-[15px] font-bold text-foreground lg:text-base">{title}</h3>
          <div className="mt-2.5">
            {product.price ? (
              <div className="flex items-baseline gap-1.5">
                <span
                  className={
                    (isSold ? "text-muted-foreground line-through " : "text-primary ") +
                    "font-heading text-lg font-black lg:text-[22px]"
                  }
                >
                  {product.price}
                </span>
                <span className="text-[11.5px] font-medium text-muted-foreground">
                  {locale === "en" ? "JOD" : "د.أ"}
                </span>
              </div>
            ) : (
              <p className="font-heading text-[13.5px] font-extrabold text-gold-dark lg:text-base">
                {priceOnRequestLabel}
              </p>
            )}
          </div>
        </Link>
      </div>
    </Reveal>
  );
}
