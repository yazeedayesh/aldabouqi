import { getDb } from "../src/db";
import { categories } from "../src/db/schema";

// The 5 categories that were previously hardcoded in store/page.tsx and
// product-form.tsx, seeded verbatim so this migration to admin-managed
// categories doesn't change what's already live.
async function main() {
  const db = getDb();
  await db.insert(categories).values([
    { slug: "bedrooms", nameAr: "غرف نوم", nameEn: "Bedrooms", sortOrder: 0 },
    { slug: "salons", nameAr: "صالونات", nameEn: "Salons", sortOrder: 1 },
    { slug: "offices", nameAr: "مكاتب", nameEn: "Offices", sortOrder: 2 },
    { slug: "appliances", nameAr: "أجهزة كهربائية", nameEn: "Appliances", sortOrder: 3 },
    { slug: "other", nameAr: "أخرى", nameEn: "Other", sortOrder: 4 },
  ]);
  console.log("Seeded 5 categories.");
}

main();
