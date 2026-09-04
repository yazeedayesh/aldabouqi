import type { MetadataRoute } from "next";
import { ne } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
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

  // The 36 neighborhood pages are Arabic-only — /en/buy-used-furniture-*
  // redirects into these via vercel.json, it isn't separate content.
  for (const area of areas) {
    entries.push({ url: arUrl(`/buy-used-furniture-${area.slug}`) });
  }

  const liveProducts = await getDb()
    .select({ slug: products.slug, updatedAt: products.updatedAt })
    .from(products)
    .where(ne(products.status, "draft"));

  for (const product of liveProducts) {
    entries.push(...bilingualEntry(`/store/${product.slug}`, product.updatedAt));
  }

  return entries;
}
