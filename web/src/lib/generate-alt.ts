import type { ProductImage } from "@/db/schema";

/**
 * Default alt text for a product image when the admin leaves the field
 * empty — never an empty string reaches the database (site owner rule,
 * 2026-09-06: "ولا صورة منتج تنعرض بـalt فاضي أبدًا").
 */
export function generateDefaultAlt(titleAr: string, categoryNameAr: string): string {
  return `${titleAr} ${categoryNameAr} مستعمل في عمان`;
}

/**
 * Fills any blank/whitespace-only alt with the generated default and stamps
 * order from array position — order is never trusted from the client, the
 * array's position when saved is the single source of truth for ordering.
 */
export function fillImageAlts(
  images: { url: string; alt: string }[],
  titleAr: string,
  categoryNameAr: string
): ProductImage[] {
  return images.map((img, index) => ({
    url: img.url,
    alt: img.alt.trim() || generateDefaultAlt(titleAr, categoryNameAr),
    order: index,
  }));
}
