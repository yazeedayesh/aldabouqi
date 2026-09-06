// One-time data migration: converts existing products.images from a plain
// string[] of URLs into {url, alt}[] with a generated alt for every entry,
// now that the schema/admin panel store per-image alt text (site owner
// follow-up, 2026-09-06 — "ولا صورة منتج تنعرض بـalt فاضي أبدًا"). Safe to
// re-run: any row whose images are already {url,alt} objects is skipped.
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { categories, products } from "../src/db/schema";
import { generateDefaultAlt } from "../src/lib/generate-alt";

async function main() {
  const db = getDb();
  const rows = await db
    .select({ id: products.id, titleAr: products.titleAr, images: products.images, category: products.category })
    .from(products);
  const categoryRows = await db.select().from(categories);
  const nameBySlug = new Map(categoryRows.map((c) => [c.slug, c.nameAr]));

  let migrated = 0;
  let skipped = 0;

  for (const row of rows) {
    const images = row.images as unknown as Array<string | { url: string; alt: string }>;
    const alreadyMigrated = images.every((img) => typeof img === "object" && img !== null && "url" in img);
    if (alreadyMigrated) {
      skipped++;
      continue;
    }

    const categoryNameAr = nameBySlug.get(row.category) ?? "";
    const newImages = images.map((img) =>
      typeof img === "string" ? { url: img, alt: generateDefaultAlt(row.titleAr, categoryNameAr) } : img
    );

    await db.update(products).set({ images: newImages }).where(eq(products.id, row.id));
    migrated++;
  }

  console.log(`Migrated ${migrated} product(s), skipped ${skipped} already-migrated product(s).`);
}

main();
