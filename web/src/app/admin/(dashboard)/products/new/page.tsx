import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, contactNumbers } from "@/db/schema";
import { AdminPageHeader } from "../../admin-page-header";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const [categoryRows, contactNumberRows] = await Promise.all([
    getDb().select().from(categories).orderBy(asc(categories.sortOrder)),
    getDb().select().from(contactNumbers).orderBy(asc(contactNumbers.sortOrder)),
  ]);

  return (
    <div>
      <AdminPageHeader title="إضافة منتج" subtitle="منتج جديد" />
      <ProductForm categories={categoryRows} contactNumbers={contactNumberRows} />
    </div>
  );
}
