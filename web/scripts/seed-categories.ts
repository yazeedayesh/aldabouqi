import { sql } from "drizzle-orm";
import { getDb } from "../src/db";
import { categories } from "../src/db/schema";

// Idempotent upsert (not a one-shot insert) so this can be re-run safely to
// bring an existing database's 5 categories up to the current 8 — renaming
// display names on the original 5 without touching their slugs (so existing
// product rows and any indexed /store?category= links keep working), and
// adding the 3 new ones.
const rows = [
  { slug: "bedrooms", nameAr: "غرف نوم", nameEn: "Bedrooms", sortOrder: 0 },
  { slug: "salons", nameAr: "كنب", nameEn: "Sofas & Living Room", sortOrder: 1 },
  { slug: "offices", nameAr: "مكاتب وكراسي", nameEn: "Office Furniture & Chairs", sortOrder: 2 },
  { slug: "appliances", nameAr: "أجهزة كهربائية منزلية", nameEn: "Home Appliances", sortOrder: 3 },
  { slug: "other", nameAr: "نثريات وديكور", nameEn: "Decor & Miscellaneous", sortOrder: 4 },
  { slug: "bedrooms-no-wardrobe", nameAr: "غرف نوم بدون خزائن", nameEn: "Bedrooms without Wardrobe", sortOrder: 5 },
  { slug: "dining-tables", nameAr: "طاولات سفرة", nameEn: "Dining Tables", sortOrder: 6 },
  { slug: "electronics", nameAr: "إلكترونيات", nameEn: "Electronics", sortOrder: 7 },
];

async function main() {
  const db = getDb();
  for (const row of rows) {
    await db
      .insert(categories)
      .values(row)
      .onConflictDoUpdate({
        target: categories.slug,
        set: {
          nameAr: row.nameAr,
          nameEn: row.nameEn,
          sortOrder: row.sortOrder,
          updatedAt: sql`now()`,
        },
      });
  }
  console.log(`Upserted ${rows.length} categories.`);
}

main();
