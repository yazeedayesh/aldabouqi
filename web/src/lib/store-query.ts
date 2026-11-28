import { productConditions } from "@/lib/validation";
import type { StoreListingProduct } from "@/lib/store-data";

export type StoreSort = "newest" | "cheapest" | "priciest";

export type StoreFilters = {
  conditions: (typeof productConditions)[number][];
  minPrice?: number;
  maxPrice?: number;
  includeSold: boolean;
  sort: StoreSort;
  page: number;
  /** Free-text search over product titles (v2 identity brief, 2026-09-07 —
   * the homepage hero search bar). */
  q?: string;
};

export const DEFAULT_STORE_FILTERS: StoreFilters = {
  conditions: [],
  includeSold: false,
  sort: "newest",
  page: 1,
};

const PAGE_SIZE = 12;
export { PAGE_SIZE };

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseStoreFilters(searchParams: SearchParams): StoreFilters {
  const conditionRaw = first(searchParams.condition) ?? "";
  const conditions = conditionRaw
    .split(",")
    .filter((c): c is (typeof productConditions)[number] => (productConditions as readonly string[]).includes(c));

  const minPrice = first(searchParams.minPrice) ? Number(first(searchParams.minPrice)) : undefined;
  const maxPrice = first(searchParams.maxPrice) ? Number(first(searchParams.maxPrice)) : undefined;

  const sortRaw = first(searchParams.sort);
  const sort: StoreSort = sortRaw === "cheapest" || sortRaw === "priciest" ? sortRaw : "newest";

  const pageRaw = Number(first(searchParams.page));
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const qRaw = first(searchParams.q)?.trim();

  return {
    conditions,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    includeSold: first(searchParams.sold) === "1",
    sort,
    page,
    q: qRaw ? qRaw : undefined,
  };
}

/** Applies overrides on top of the current filters, resetting `page` unless explicitly overridden — the one merge rule shared by every filter control (category links aside) so changing a filter always lands back on page 1. */
export function mergeStoreFilters(filters: StoreFilters, overrides: Partial<StoreFilters>): StoreFilters {
  const next: StoreFilters = { ...filters, ...overrides };
  if (!("page" in overrides)) next.page = 1;
  return next;
}

/** Builds a query string (for the address bar only — see StorePageContent's applyFilters) from an already-merged StoreFilters. */
export function buildStoreQuery(filters: StoreFilters): string {
  const params = new URLSearchParams();
  if (filters.conditions.length > 0) params.set("condition", filters.conditions.join(","));
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.includeSold) params.set("sold", "1");
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.q) params.set("q", filters.q);
  if (filters.page !== 1) params.set("page", String(filters.page));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export type StoreView = {
  products: StoreListingProduct[];
  totalCount: number;
  baseTotalCount: number;
  totalPages: number;
  countByCategory: Map<string, number>;
  countByCondition: Map<string, number>;
  priceBounds: { min: number; max: number };
};

/**
 * The client-side equivalent of the old getStoreData() SQL aggregates
 * (lib/store-data.ts's getCachedProducts() now does the one DB read; this
 * does the filtering/sorting/counting/pagination in memory against that
 * cached array) — moved off the DB so /store and /store/[category] can be
 * static/ISR instead of forced-dynamic by reading searchParams server-side.
 * Mirrors the original SQL semantics exactly:
 * - baseTotalCount / countByCategory ignore `categorySlug` and every filter
 *   except `includeSold` (they describe the whole catalog, for the "all
 *   categories" link and the category sidebar counts).
 * - countByCondition / priceBounds respect `includeSold` and `categorySlug`
 *   but not condition/price/search (they describe the options being
 *   offered, not the narrowed result set).
 * - totalCount / products respect every filter.
 */
export function buildStoreView(
  allProducts: StoreListingProduct[],
  categorySlug: string | undefined,
  filters: StoreFilters
): StoreView {
  const statuses: StoreListingProduct["status"][] = filters.includeSold ? ["available", "sold"] : ["available"];
  const inStatus = allProducts.filter((p) => statuses.includes(p.status));
  const categoryScoped = categorySlug ? inStatus.filter((p) => p.category === categorySlug) : inStatus;

  let filtered = categoryScoped;
  if (filters.conditions.length > 0) {
    filtered = filtered.filter((p) => filters.conditions.includes(p.condition));
  }
  if (filters.minPrice != null) {
    const min = filters.minPrice;
    filtered = filtered.filter((p) => p.price != null && p.price >= min);
  }
  if (filters.maxPrice != null) {
    const max = filters.maxPrice;
    filtered = filtered.filter((p) => p.price != null && p.price <= max);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    filtered = filtered.filter((p) => p.titleAr.toLowerCase().includes(q) || p.titleEn.toLowerCase().includes(q));
  }

  const sorted =
    filters.sort === "cheapest"
      ? [...filtered].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      : filters.sort === "priciest"
        ? [...filtered].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
        : [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageItems = sorted.slice((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE);

  const countByCategory = new Map<string, number>();
  for (const p of inStatus) countByCategory.set(p.category, (countByCategory.get(p.category) ?? 0) + 1);

  const countByCondition = new Map<string, number>();
  for (const p of categoryScoped) countByCondition.set(p.condition, (countByCondition.get(p.condition) ?? 0) + 1);

  let min = Infinity;
  let max = 0;
  for (const p of categoryScoped) {
    if (p.price == null) continue;
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  if (!Number.isFinite(min)) min = 0;

  return {
    products: pageItems,
    totalCount,
    baseTotalCount: inStatus.length,
    totalPages,
    countByCategory,
    countByCondition,
    priceBounds: { min, max: max || 1000 },
  };
}
