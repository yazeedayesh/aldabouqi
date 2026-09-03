import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { ProductForm } from "../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product] = await getDb().select().from(products).where(eq(products.id, id));
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">تعديل المنتج</h1>
      <ProductForm product={product} />
    </div>
  );
}
