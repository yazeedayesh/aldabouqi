import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { categories, contactNumbers, products } from "@/db/schema";
import { AdminPageHeader } from "../../admin-page-header";
import { ProductForm } from "../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [[product], categoryRows, contactNumberRows] = await Promise.all([
    getDb().select().from(products).where(eq(products.id, id)),
    getDb().select().from(categories).orderBy(asc(categories.sortOrder)),
    getDb().select().from(contactNumbers).orderBy(asc(contactNumbers.sortOrder)),
  ]);
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader
        title="تعديل منتج"
        subtitle={`${product.titleAr} · آخر تعديل ${new Date(product.updatedAt).toLocaleDateString("ar-JO", { dateStyle: "medium" })}`}
      />
      <ProductForm key={product.id} product={product} categories={categoryRows} contactNumbers={contactNumberRows} />
    </div>
  );
}
