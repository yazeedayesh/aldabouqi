import { getDb } from "../src/db";
import { products } from "../src/db/schema";

async function main() {
  const db = getDb();
  await db.insert(products).values([
    {
      slug: "bedroom-set-turkish-1",
      titleAr: "غرفة نوم تركي مستعملة",
      titleEn: "Used Turkish Bedroom Set",
      descriptionAr: "غرفة نوم تركي بحالة ممتازة، تشمل دولاب 6 أبواب وسرير وكومودينتين.",
      descriptionEn: "Turkish bedroom set in excellent condition, includes a 6-door wardrobe, bed, and two nightstands.",
      category: "bedrooms",
      condition: "excellent",
      price: 250,
      area: "khalda",
      status: "available",
      images: [],
    },
    {
      slug: "office-desk-set-1",
      titleAr: "طقم مكتب إداري مستعمل",
      titleEn: "Used Executive Office Desk Set",
      descriptionAr: "مكتب إداري مع كرسي وخزانة ملفات جانبية، حالة جيدة جداً.",
      descriptionEn: "Executive desk with chair and side filing cabinet, very good condition.",
      category: "offices",
      condition: "good",
      price: null,
      area: "shmeisani",
      status: "available",
      images: [],
    },
  ]);
  console.log("Seeded 2 products.");
}

main();
