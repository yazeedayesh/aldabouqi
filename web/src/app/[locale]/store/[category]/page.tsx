import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { permanentRedirect } from "@/i18n/navigation";
import { getDb } from "@/db";
import { products } from "@/db/schema";

/**
 * Legacy route: the product page used to live at /store/{slug} (one level
 * deep). It now lives at /store/{category}/{slug} (brief §10.1) so a
 * product's URL carries its category. This stub keeps every old link/
 * bookmark/indexed URL alive by looking the product up by its old
 * single-segment slug and permanently redirecting into its real category
 * path — Next's permanentRedirect() issues a 308, the modern equivalent of
 * a 301 (method-preserving, cached by Google identically to a 301) —
 * rather than a static per-slug list, so any old-shaped link keeps working
 * automatically. Uses the next-intl `permanentRedirect` (not
 * next/navigation's) so the /en/ prefix is kept for English visitors
 * instead of dropping them onto the Arabic path.
 *
 * Lives at the folder name [category] (not [slug]) purely because Next.js
 * requires sibling dynamic segments at the same tree position — this route
 * and the real .../[category]/[slug] route below it — to share one param
 * name. The value here is actually the legacy product slug, not a category.
 */
export default async function LegacyProductRedirect({
  params,
}: PageProps<"/[locale]/store/[category]">) {
  const { locale, category: legacySlug } = await params;

  const [product] = await getDb().select().from(products).where(eq(products.slug, legacySlug));
  if (!product) notFound();

  permanentRedirect({ href: `/store/${product.category}/${product.slug}`, locale });
}
