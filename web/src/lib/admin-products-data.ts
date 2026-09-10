import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries, products } from "@/db/schema";
import { ADMIN_PAGE_SIZE, type AdminProductFilters } from "@/lib/admin-products-query";

export async function getAdminProductsData(filters: AdminProductFilters) {
  const db = getDb();
  const conditions = [];
  if (filters.category) conditions.push(eq(products.category, filters.category));
  if (filters.visibility) conditions.push(eq(products.visibility, filters.visibility));
  if (filters.q) {
    const pattern = `%${filters.q}%`;
    conditions.push(
      or(ilike(products.titleAr, pattern), ilike(products.titleEn, pattern), ilike(products.slug, pattern))!
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const orderBy =
    filters.sort === "cheapest"
      ? sql`${products.price} ASC NULLS LAST`
      : filters.sort === "priciest"
        ? sql`${products.price} DESC NULLS LAST`
        : desc(products.createdAt);

  const [totalCountRow, rows, inquiryCounts, [{ total }], [{ published }]] = await Promise.all([
    db.select({ value: count() }).from(products).where(where),
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(orderBy)
      .limit(ADMIN_PAGE_SIZE)
      .offset((filters.page - 1) * ADMIN_PAGE_SIZE),
    db.select({ productId: inquiries.productId, value: count() }).from(inquiries).groupBy(inquiries.productId),
    db.select({ total: count() }).from(products),
    db.select({ published: count() }).from(products).where(eq(products.visibility, "published")),
  ]);

  const inquiryCountByProduct = new Map(inquiryCounts.map((r) => [r.productId, r.value]));
  const totalCount = totalCountRow[0]?.value ?? 0;

  return {
    products: rows,
    inquiryCountByProduct,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE)),
    allProductsTotal: total,
    allProductsPublished: published,
    allProductsHidden: total - published,
  };
}
