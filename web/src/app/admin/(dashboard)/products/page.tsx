import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { getAdminProductsData } from "@/lib/admin-products-data";
import { parseAdminProductFilters } from "@/lib/admin-products-query";
import { AdminPageHeader } from "../admin-page-header";
import { ProductsTable } from "./products-table";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseAdminProductFilters(sp);

  const [categoryRows, data] = await Promise.all([
    getDb().select().from(categories).orderBy(asc(categories.sortOrder)),
    getAdminProductsData(filters),
  ]);

  const inquiryCounts = Object.fromEntries(
    Array.from(data.inquiryCountByProduct.entries()).filter(([id]) => id != null) as [string, number][]
  );

  return (
    <div>
      <AdminPageHeader
        title="المنتجات"
        subtitle={`${data.allProductsTotal} منتج · ${data.allProductsPublished} منشور · ${data.allProductsHidden} مخفي`}
        actions={
          <Link
            href="/admin/products/new"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4.5 text-[13.5px] font-bold text-primary-foreground"
          >
            <Plus className="size-4" />
            أضف منتج
          </Link>
        }
      />
      <ProductsTable
        products={data.products}
        categories={categoryRows}
        inquiryCounts={inquiryCounts}
        filters={filters}
        totalCount={data.totalCount}
        totalPages={data.totalPages}
      />
    </div>
  );
}
