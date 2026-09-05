import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ProductImagePlaceholder } from "@/components/store/product-image-placeholder";
import { InterestToggleButton } from "@/components/store/interest-toggle-button";
import { Reveal } from "@/components/ui/reveal";
import { getCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/db/schema";

const conditionLabels = {
  ar: { excellent: "ممتازة", good: "جيدة", fair: "مقبولة" },
  en: { excellent: "Excellent", good: "Good", fair: "Fair" },
} as const;

/**
 * Shared between /store (all categories, chips filter by linking to the
 * dedicated category page) and /store/[category] (one category, real
 * indexed page rather than a ?category= query param — brief follow-up,
 * 2026-09-05: 8 real landing pages beat a same-URL filter for ranking).
 */
export function StoreGridSection({
  locale,
  categories,
  activeCategorySlug,
  products,
  content,
}: {
  locale: "ar" | "en";
  categories: Category[];
  activeCategorySlug?: string;
  products: Product[];
  content: {
    shopByCategory: string;
    all: string;
    empty: string;
    noPhotoYet: string;
    priceOnRequest: string;
  };
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {content.shopByCategory}
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <CategoryChip href="/store" active={!activeCategorySlug} label={content.all} />
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug);
          return (
            <CategoryChip
              key={cat.slug}
              href={`/store/${cat.slug}`}
              active={activeCategorySlug === cat.slug}
              label={locale === "en" ? cat.nameEn : cat.nameAr}
              image={cat.image}
              icon={Icon}
            />
          );
        })}
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">{content.empty}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const title = locale === "en" ? product.titleEn : product.titleAr;
            return (
              <Reveal key={product.id} delayMs={(i % 6) * 90}>
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
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <ProductImagePlaceholder label={content.noPhotoYet} categorySlug={product.category} />
                    )}
                    <span className="absolute bottom-3 start-3 rounded-full bg-ink/90 px-3 py-1 text-xs font-semibold text-ink-foreground backdrop-blur-sm">
                      {product.price ? `${product.price} ${locale === "en" ? "JOD" : "د.أ"}` : content.priceOnRequest}
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
                    <p className="text-xs font-medium text-primary">
                      {conditionLabels[locale][product.condition]}
                    </p>
                    <h3 className="mt-1 font-heading font-semibold text-foreground transition-colors group-hover:text-primary">
                      {title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
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
