import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { areas } from "@/lib/areas";
import { SITE_URL } from "@/lib/constants";

// Static routes that have a real bilingual pair (both rendered by
// [locale]/.../page.tsx with hasEnglishVariant left at its default true).
const bilingualPaths = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/coverage-areas",
  "/partner",
  "/privacy-policy",
  "/buy-used-bedrooms",
  "/buy-used-home-furniture",
  "/buy-used-office-furniture",
  "/buy-used-appliances",
  "/house-clearance",
  "/buy-antiques",
  "/buy-used-sofas",
  "/buy-used-kitchens",
  "/store",
];

function arUrl(path: string) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function enUrl(path: string) {
  return path === "/" ? `${SITE_URL}/en` : `${SITE_URL}/en${path}`;
}

// Ar+en pair, each entry carrying hreflang alternates for both — same
// pattern Next.js's own sitemap-with-alternates docs use.
function bilingualEntry(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  const languages = { ar: arUrl(path), en: enUrl(path) };
  return [
    { url: arUrl(path), lastModified, alternates: { languages } },
    { url: enUrl(path), lastModified, alternates: { languages } },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = bilingualPaths.flatMap((path) => bilingualEntry(path));

  // The 36 neighborhood pages now have real English content too
  // (site owner request, 2026-09-10).
  for (const area of areas) {
    entries.push(...bilingualEntry(`/buy-used-furniture-${area.slug}`));
  }

  // The 44 static links above must reach Google even if Neon is briefly
  // unreachable — a transient DB outage must never take the whole sitemap
  // (and the build that generates it) down with it.
  try {
    const [categoryRows, liveProducts] = await Promise.all([
      getDb()
        .select({ slug: categories.slug, updatedAt: categories.updatedAt })
        .from(categories)
        .where(eq(categories.hidden, false)),
      getDb()
        .select({ slug: products.slug, category: products.category, updatedAt: products.updatedAt })
        .from(products)
        .where(eq(products.visibility, "published")),
    ]);

    // The 8 category landing pages (/store/{category}) — real indexed
    // pages, not a ?category= filter, per the site owner's follow-up.
    for (const category of categoryRows) {
      entries.push(...bilingualEntry(`/store/${category.slug}`, category.updatedAt));
    }

    for (const product of liveProducts) {
      entries.push(...bilingualEntry(`/store/${product.category}/${product.slug}`, product.updatedAt));
    }
  } catch (error) {
    console.error("sitemap: failed to load products from the database, serving static routes only", error);
  }

  return entries;
}
