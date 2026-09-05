import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ProductImagePlaceholder } from "@/components/store/product-image-placeholder";
import { InterestToggleButton } from "@/components/store/interest-toggle-button";
import { Reveal } from "@/components/ui/reveal";
import type { Product } from "@/db/schema";

const conditionLabels = {
  ar: { excellent: "ممتازة", good: "جيدة", fair: "مقبولة" },
  en: { excellent: "Excellent", good: "Good", fair: "Fair" },
} as const;

/**
 * The one product card used everywhere a product is listed — /store,
 * /store/[category], and the homepage's featured-products section — so
 * there's a single place to change how a listing looks (site owner
 * follow-up, 2026-09-05: "استخدم نفس مكوّن بطاقة المنتج، لا تكرر كود").
 */
export function ProductCard({
  product,
  locale,
  delayMs = 0,
  noPhotoLabel,
  priceOnRequestLabel,
}: {
  product: Product;
  locale: "ar" | "en";
  delayMs?: number;
  noPhotoLabel: string;
  priceOnRequestLabel: string;
}) {
  const title = locale === "en" ? product.titleEn : product.titleAr;
  return (
    <Reveal delayMs={delayMs}>
      <Link
        href={`/store/${product.category}/${product.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg"
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={title}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <ProductImagePlaceholder label={noPhotoLabel} categorySlug={product.category} />
          )}
          <span className="absolute bottom-3 start-3 rounded-full bg-ink/90 px-3 py-1 text-xs font-semibold text-ink-foreground backdrop-blur-sm">
            {product.price ? `${product.price} ${locale === "en" ? "JOD" : "د.أ"}` : priceOnRequestLabel}
          </span>
          <InterestToggleButton
            slug={product.slug}
            categorySlug={product.category}
            titleAr={product.titleAr}
            titleEn={product.titleEn}
            locale={locale}
            className="absolute end-3 top-3"
          />
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-primary">{conditionLabels[locale][product.condition]}</p>
          <h3 className="mt-1 font-heading font-semibold text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
        </div>
      </Link>
    </Reveal>
  );
}
