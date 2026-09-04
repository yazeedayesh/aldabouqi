import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { ProductForm } from "../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [[product], categoryRows] = await Promise.all([
    getDb().select().from(products).where(eq(products.id, id)),
    getDb().select().from(categories).orderBy(asc(categories.sortOrder)),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">تعديل المنتج</h1>
      <ProductForm product={product} categories={categoryRows} />
    </div>
  );
}
