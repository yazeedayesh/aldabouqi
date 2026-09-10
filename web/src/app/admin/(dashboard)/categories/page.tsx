import Link from "next/link";
import Image from "next/image";
import { asc, count, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { AdminPageHeader } from "../admin-page-header";
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
      <AdminPageHeader
        title="الأقسام"
        subtitle={`${rows.length} قسم`}
        actions={
          <Link
            href="/admin/categories/new"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4.5 text-[13.5px] font-bold text-primary-foreground"
          >
            <Plus className="size-4" />
            إضافة قسم
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-[22px] bg-white p-6.5">
          <div className="py-16 text-center">
            <p className="mb-4 text-admin-muted">لا يوجد أقسام بعد</p>
            <Link href="/admin/categories/new" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">
              <Plus className="size-4" />
              إضافة أول قسم
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-3 lg:hidden">
            {rows.map((category) => (
              <div key={category.id} className="flex items-center gap-3 rounded-[20px] bg-white p-4">
                {category.image ? (
                  <Image src={category.image} alt="" width={52} height={52} className="size-13 shrink-0 rounded-[12px] object-cover" />
                ) : (
                  <div className="size-13 shrink-0 rounded-[12px] bg-admin-divider" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-semibold text-foreground">{category.nameAr}</p>
                    {category.hidden && (
                      <span className="shrink-0 rounded-full bg-admin-divider px-2 py-0.5 text-[11px] font-semibold text-admin-muted">مخفي</span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-admin-muted-2">{category.productCount} منتج · {category.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Link href={`/admin/categories/${category.id}`} className="flex h-9 items-center rounded-[11px] bg-admin-input px-3 text-[12.5px] font-semibold text-admin-muted-2">
                    تعديل
                  </Link>
                  <DeleteCategoryButton id={category.id} disabled={category.productCount > 0} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden rounded-[22px] bg-white p-6.5 lg:block">
            <div className="grid grid-cols-[50px_minmax(0,1fr)_140px_100px_140px] items-center gap-3.5 pb-3 text-[12.5px] font-semibold text-admin-muted">
              <div />
              <div>الاسم</div>
              <div>الرابط</div>
              <div>عدد المنتجات</div>
              <div />
            </div>
            {rows.map((category) => (
              <div key={category.id} className="grid grid-cols-[50px_minmax(0,1fr)_140px_100px_140px] items-center gap-3.5 border-t border-admin-divider py-3.5">
                {category.image ? (
                  <Image src={category.image} alt="" width={40} height={40} className="size-10 rounded-lg object-cover" />
                ) : (
                  <div className="size-10 rounded-lg bg-admin-divider" />
                )}
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-[14.5px] font-semibold text-foreground">{category.nameAr}</p>
                  {category.hidden && (
                    <span className="shrink-0 rounded-full bg-admin-divider px-2 py-0.5 text-[11px] font-semibold text-admin-muted">مخفي</span>
                  )}
                </div>
                <div dir="ltr" className="truncate text-end font-mono text-[12.5px] text-admin-faint">{category.slug}</div>
                <div className="text-[13.5px] text-admin-muted-2">{category.productCount}</div>
                <div className="flex justify-end gap-1.5">
                  <Link href={`/admin/categories/${category.id}`} className="flex h-9 items-center rounded-[11px] bg-admin-input px-3.5 text-[13px] font-semibold text-admin-muted-2">
                    تعديل
                  </Link>
                  <DeleteCategoryButton id={category.id} disabled={category.productCount > 0} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
