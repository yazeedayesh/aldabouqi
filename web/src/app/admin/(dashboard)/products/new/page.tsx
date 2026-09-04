import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categoryRows = await getDb().select().from(categories).orderBy(asc(categories.sortOrder));

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">إضافة منتج جديد</h1>
      <ProductForm categories={categoryRows} />
    </div>
  );
}
