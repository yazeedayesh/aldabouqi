import type { ProductImage } from "@/db/schema";

/**
 * Default alt text for a product image when the admin leaves the field
 * empty — never an empty string reaches the database (site owner rule,
 * 2026-09-06: "ولا صورة منتج تنعرض بـalt فاضي أبدًا").
 */
export function generateDefaultAlt(titleAr: string, categoryNameAr: string): string {
  return `${titleAr} ${categoryNameAr} مستعمل في عمان`;
}

/** Fills any blank/whitespace-only alt with the generated default, in place semantics (returns a new array). */
export function fillImageAlts(images: ProductImage[], titleAr: string, categoryNameAr: string): ProductImage[] {
  return images.map((img) => ({
    url: img.url,
    alt: img.alt.trim() || generateDefaultAlt(titleAr, categoryNameAr),
  }));
}
