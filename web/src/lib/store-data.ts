import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";

/**
 * The store catalog barely changes minute-to-minute (admin edits call
 * revalidateTag/revalidatePath on save — see the admin API routes), so an
 * hour is a safe ceiling: it bounds how stale a background-revalidate
 * failure can leave the site, without re-querying Neon on every storefront
 * visit. Every store-facing DB read goes through one of the two cached
 * functions below — /store and /store/[category] no longer run their own
 * per-request queries, they slice these two cached arrays in memory.
 */
const STORE_REVALIDATE_SECONDS = 3600;

/**
 * All categories, hidden ones included — callers decide whether hidden
 * categories should be visible (same "hidden ≠ deleted" rule as products:
 * a hidden category's own /store/{slug} page must keep resolving).
 */
export const getCachedCategories = unstable_cache(
  async () => {
    return getDb().select().from(categoriesTable);
  },
  ["store-categories"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: ["categories", "store"] }
);

/**
 * Every published product, every status, every category — filtering,
 * sorting, and pagination all happen client-side (see lib/store-query.ts's
 * buildStoreView) against this one array, so /store and /store/[category]
 * can be fully static/ISR instead of re-querying per visitor per filter.
 *
 * Column list is deliberately narrow: this whole array ships to the
 * browser as the listing grid's props (see StorePageContent), so every
 * column here is weighed against every visitor's payload. Only
 * descriptionAr/En, specs, area, visibility (always "published" after the
 * where-clause), and the two contact-number ids are dropped — nothing
 * ProductCard, buildStoreView, or any other caller of this function
 * (header's count, the homepage's per-category counts, sitemap.ts) reads
 * from this list actually needs them; they're only used on the product
 * detail page itself, which fetches its own full row via
 * getCachedProductBySlug below.
 */
export const getCachedProducts = unstable_cache(
  async () => {
    return getDb()
      .select({
        id: products.id,
        slug: products.slug,
        titleAr: products.titleAr,
        titleEn: products.titleEn,
        category: products.category,
        condition: products.condition,
        price: products.price,
        negotiable: products.negotiable,
        status: products.status,
        images: products.images,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.visibility, "published"))
      .orderBy(desc(products.createdAt));
  },
  ["store-products"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: ["products", "store"] }
);

/** The narrowed row shape getCachedProducts() resolves to — derived from the query itself so the type can never drift from the actual column list above. */
export type StoreListingProduct = Awaited<ReturnType<typeof getCachedProducts>>[number];

/**
 * Single-product lookup for the product detail page and the legacy
 * /store/{old-slug} redirect check — cached per-slug (unstable_cache keys
 * on its arguments automatically) rather than scanning getCachedProducts(),
 * since this also needs to find non-published (draft/hidden) rows that the
 * listing cache deliberately excludes.
 */
export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    const [row] = await getDb().select().from(products).where(eq(products.slug, slug));
    return row ?? null;
  },
  ["store-product-by-slug"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: ["products", "store"] }
);
