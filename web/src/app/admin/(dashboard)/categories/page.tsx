import Link from "next/link";
import Image from "next/image";
import { asc, count, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { DeleteCategoryButton } from "./delete-category-button";

export default async function AdminCategoriesPage() {
  const rows = await getDb()
    .select({
      id: categories.id,
      slug: categories.slug,
      nameAr: categories.nameAr,
      nameEn: categories.nameEn,
      image: categories.image,
      sortOrder: categories.sortOrder,
      hidden: categories.hidden,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(products.category, categories.slug))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">الفئات</h1>
        <Button nativeButton={false} render={<Link href="/admin/categories/new" />}>
          <Plus className="size-4" />
          إضافة فئة
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-start">
            <tr>
              <th className="p-3 text-start font-medium">الصورة</th>
              <th className="p-3 text-start font-medium">الاسم</th>
              <th className="p-3 text-start font-medium">الرابط</th>
              <th className="p-3 text-start font-medium">عدد المنتجات</th>
              <th className="p-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((category) => (
              <tr key={category.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-secondary" />
                  )}
                </td>
                <td className="p-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {category.nameAr}
                    {category.hidden && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        مخفي
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{category.slug}</td>
                <td className="p-3 text-muted-foreground">{category.productCount}</td>
                <td className="p-3 text-end">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      تعديل
                    </Link>
                    <DeleteCategoryButton id={category.id} disabled={category.productCount > 0} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <p className="text-muted-foreground">لا يوجد فئات بعد</p>
                  <Button className="mt-4" nativeButton={false} render={<Link href="/admin/categories/new" />}>
                    <Plus className="size-4" />
                    إضافة أول فئة
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
