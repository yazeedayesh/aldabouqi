import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";
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

export async function generateMetadata({ params }: PageProps<"/[locale]/store/[slug]">) {
  const { locale, slug } = await params;
  const [product] = await getDb().select().from(products).where(eq(products.slug, slug));
  if (!product) return {};

  const title = locale === "en" ? product.titleEn : product.titleAr;
  const description = locale === "en" ? product.descriptionEn : product.descriptionAr;

  return buildMetadata({
    title: `${title} | ${BUSINESS.nameAr}`,
    description,
    path: `/store/${slug}`,
    locale: locale as Locale,
    ogImage: product.images[0],
  });
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/[locale]/store/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [product] = await getDb().select().from(products).where(eq(products.slug, slug));
  if (!product || product.status === "draft") notFound();

  const title = locale === "en" ? product.titleEn : product.titleAr;
  const description = locale === "en" ? product.descriptionEn : product.descriptionAr;
  const isAvailable = product.status === "available";

  return (
    <>
      <PageHero title={title} crumbs={[{ href: "/store", label: locale === "en" ? "Store" : "المتجر" }, { href: `/store/${slug}`, label: title }]} />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary/40">
            {product.images[0] && (
              <Image src={product.images[0]} alt={title} fill priority className="object-cover" />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((url) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-lg bg-secondary/40">
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
            {!isAvailable && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {statusLabels[locale as Locale][product.status]}
              </span>
            )}
          </div>

          <p className="mt-4 text-2xl font-bold text-primary">
            {product.price
              ? `${product.price} ${locale === "en" ? "JOD" : "د.أ"}`
              : locale === "en"
                ? "Price on inspection"
                : "السعر عند المعاينة"}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {(locale === "en" ? "Condition: " : "الحالة: ") + conditionLabels[locale as Locale][product.condition]}
          </p>

          <p className="mt-6 leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {isAvailable ? (
              <Button size="lg" nativeButton={false} render={<Link href={`/store/checkout?product=${product.slug}`} />}>
                <ShoppingCart className="size-4" />
                {locale === "en" ? "Order (Cash on Delivery)" : "اطلب الآن (دفع عند الاستلام)"}
              </Button>
            ) : null}
            <Button
              size="lg"
              variant="outline"
              className="border-[#25D366] text-[#1ebe57] hover:bg-[#25D366]/10"
              nativeButton={false}
              render={
                <a
                  href={buildWhatsAppLink(
                    locale === "en"
                      ? `Hi, I'm interested in: ${title}`
                      : `مرحباً، بدي أستفسر عن: ${title}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircle className="size-4" />
              {locale === "en" ? "Ask on WhatsApp" : "استفسار عبر واتساب"}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
