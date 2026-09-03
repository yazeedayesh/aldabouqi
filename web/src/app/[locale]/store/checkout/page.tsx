import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { CheckoutForm } from "./checkout-form";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/store/checkout">) {
  const { locale } = await params;
  return buildMetadata({
    title: locale === "en" ? "Checkout | Aldabouqi Used Furniture" : "إتمام الطلب | شركة الدابوقي",
    description:
      locale === "en"
        ? "Complete your cash-on-delivery order."
        : "أكمل طلبك — الدفع نقداً عند الاستلام.",
    path: "/store/checkout",
    locale: locale as Locale,
  });
}

export default async function CheckoutPage({
  params,
  searchParams,
}: PageProps<"/[locale]/store/checkout">) {
  const { locale } = await params;
  const { product: slug } = await searchParams;
  setRequestLocale(locale);

  if (typeof slug !== "string") notFound();

  const [product] = await getDb().select().from(products).where(eq(products.slug, slug));
  if (!product || product.status !== "available") notFound();

  const title = locale === "en" ? "Checkout" : "إتمام الطلب";
  const productTitle = locale === "en" ? product.titleEn : product.titleAr;

  return (
    <>
      <PageHero
        title={title}
        crumbs={[
          { href: "/store", label: locale === "en" ? "Store" : "المتجر" },
          { href: `/store/${slug}`, label: productTitle },
          { href: `/store/checkout?product=${slug}`, label: title },
        ]}
      />

      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl border border-border bg-secondary/20 p-4">
          <p className="text-sm text-muted-foreground">
            {locale === "en" ? "Ordering:" : "بتطلب:"}
          </p>
          <p className="font-heading font-semibold text-foreground">{productTitle}</p>
          {product.price && (
            <p className="mt-1 text-sm font-medium text-primary">
              {product.price} {locale === "en" ? "JOD" : "د.أ"}
            </p>
          )}
        </div>

        <CheckoutForm
          product={{
            id: product.id,
            slug: product.slug,
            titleAr: product.titleAr,
            titleEn: product.titleEn,
            price: product.price,
          }}
          locale={locale as Locale}
        />
      </section>
    </>
  );
}
