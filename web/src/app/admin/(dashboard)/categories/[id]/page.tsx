import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { CategoryForm } from "../category-form";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category] = await getDb().select().from(categories).where(eq(categories.id, id));
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">تعديل الفئة</h1>
      <CategoryForm category={category} />
    </div>
  );
}
