import { eq, like, or } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Employees adding products don't write slugs themselves (site owner
 * request, 2026-09-08) — this makes the slug fully automatic: base it on
 * the given text (usually the English title) and disambiguate against any
 * existing product by appending -2, -3, ... so a collision never surfaces
 * as a save error. `excludeId` skips the row being edited.
 */
export async function generateUniqueProductSlug(base: string, excludeId?: string) {
  // Falls back to "product" not just when empty but also when the
  // slugified result is too short to be a meaningful URL segment (e.g. an
  // Arabic-only title with no Latin/digit characters strips down to almost
  // nothing) — the numeric suffix below still keeps it unique.
  const slugified = slugify(base);
  const baseSlug = slugified.length >= 3 ? slugified : "product";
  const rows = await getDb()
    .select({ slug: products.slug, id: products.id })
    .from(products)
    .where(or(eq(products.slug, baseSlug), like(products.slug, `${baseSlug}-%`)));
  const taken = new Set(rows.filter((r) => r.id !== excludeId).map((r) => r.slug));
  if (!taken.has(baseSlug)) return baseSlug;
  let n = 2;
  while (taken.has(`${baseSlug}-${n}`)) n++;
  return `${baseSlug}-${n}`;
}
