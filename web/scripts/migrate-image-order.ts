// One-time data migration: stamps `order` (array position) onto every
// product image that doesn't have one yet, and backfills any still-empty
// alt text — part of the store/product redesign's combined schema change
// (site owner follow-up, 2026-09-07): images gained an explicit `order`
// field alongside the existing {url, alt}. Safe to re-run: a row whose
// images already all have a numeric `order` is skipped untouched.
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
  let totalImagesBefore = 0;
  let totalImagesAfter = 0;

  for (const row of rows) {
    const images = row.images as unknown as Array<{ url: string; alt: string; order?: number }>;
    totalImagesBefore += images.length;

    const alreadyMigrated = images.every((img) => typeof img.order === "number");
    if (alreadyMigrated) {
      skipped++;
      totalImagesAfter += images.length;
      continue;
    }

    const categoryNameAr = nameBySlug.get(row.category) ?? "";
    const newImages = images.map((img, index) => ({
      url: img.url,
      alt: img.alt?.trim() || generateDefaultAlt(row.titleAr, categoryNameAr),
      order: index,
    }));

    await db.update(products).set({ images: newImages }).where(eq(products.id, row.id));
    totalImagesAfter += newImages.length;
    migrated++;
  }

  console.log(`Migrated ${migrated} product(s), skipped ${skipped} already-migrated product(s).`);
  console.log(`Image count check: ${totalImagesBefore} before -> ${totalImagesAfter} after.`);
  if (totalImagesBefore !== totalImagesAfter) {
    console.error("MISMATCH — image count changed, investigate before trusting this migration.");
    process.exitCode = 1;
  }
}

main();
