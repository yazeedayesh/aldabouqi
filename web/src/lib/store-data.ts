import { and, asc, count, desc, eq, gte, inArray, lte, max, min, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";
import { PAGE_SIZE, type StoreFilters } from "@/lib/store-query";

/**
 * Shared between /store and /store/[category] — identical filtering,
 * sorting, and pagination logic, the only difference being an optional
 * category constraint. Sidebar counts intentionally only respect the
 * availability filter, not condition/price — showing counts that shift
 * with every other filter change would make the rail itself confusing to
 * read while filtering. Category counts and the "all categories" total are
 * further never scoped to the current category (that would make every
 * other category in the rail show 0 while browsing one category page) —
 * only the condition counts and price bounds are category-scoped, since
 * those describe the products actually being listed on this page.
 */
export async function getStoreData({ categorySlug, filters }: { categorySlug?: string; filters: StoreFilters }) {
  const db = getDb();
  const statuses = filters.includeSold ? (["available", "sold"] as const) : (["available"] as const);

  const statusConditions = [inArray(products.status, statuses)];
  const categoryScopedConditions = [...statusConditions];
  if (categorySlug) categoryScopedConditions.push(eq(products.category, categorySlug));

  const fullConditions = [...categoryScopedConditions];
  if (filters.conditions.length > 0) fullConditions.push(inArray(products.condition, filters.conditions));
  if (filters.minPrice != null) fullConditions.push(gte(products.price, filters.minPrice));
  if (filters.maxPrice != null) fullConditions.push(lte(products.price, filters.maxPrice));

  const orderBy =
    filters.sort === "cheapest"
      ? sql`${products.price} ASC NULLS LAST`
      : filters.sort === "priciest"
        ? sql`${products.price} DESC NULLS LAST`
        : desc(products.createdAt);

  const [totalCountRow, baseTotalCountRow, categoryCounts, conditionCounts, priceBoundsRow, categoryRows, rows] =
    await Promise.all([
      db.select({ value: count() }).from(products).where(and(...fullConditions)),
      db.select({ value: count() }).from(products).where(and(...statusConditions)),
      db
        .select({ category: products.category, value: count() })
        .from(products)
        .where(and(...statusConditions))
        .groupBy(products.category),
      db
        .select({ condition: products.condition, value: count() })
        .from(products)
        .where(and(...categoryScopedConditions))
        .groupBy(products.condition),
      db
        .select({ min: min(products.price), max: max(products.price) })
        .from(products)
        .where(and(...categoryScopedConditions)),
      db.select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder)),
      db
        .select()
        .from(products)
        .where(and(...fullConditions))
        .orderBy(orderBy)
        .limit(PAGE_SIZE)
        .offset((filters.page - 1) * PAGE_SIZE),
    ]);

  const totalCount = totalCountRow[0]?.value ?? 0;
  const baseTotalCount = baseTotalCountRow[0]?.value ?? 0;
  const countByCategory = new Map(categoryCounts.map((r) => [r.category, r.value]));
  const countByCondition = new Map(conditionCounts.map((r) => [r.condition, r.value]));

  return {
    products: rows,
    totalCount,
    baseTotalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    categories: categoryRows.map((c) => ({ slug: c.slug, nameAr: c.nameAr, nameEn: c.nameEn, count: countByCategory.get(c.slug) ?? 0 })),
    countByCondition,
    priceBounds: {
      min: priceBoundsRow[0]?.min ?? 0,
      max: priceBoundsRow[0]?.max ?? 1000,
    },
  };
}
