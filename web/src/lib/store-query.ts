import { productConditions } from "@/lib/validation";

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

/** Builds a query string from the current filters, applying the given overrides and resetting `page` unless explicitly overridden. */
export function buildStoreQuery(filters: StoreFilters, overrides: Partial<StoreFilters>): string {
  const next: StoreFilters = { ...filters, ...overrides };
  if (!("page" in overrides)) next.page = 1;

  const params = new URLSearchParams();
  if (next.conditions.length > 0) params.set("condition", next.conditions.join(","));
  if (next.minPrice != null) params.set("minPrice", String(next.minPrice));
  if (next.maxPrice != null) params.set("maxPrice", String(next.maxPrice));
  if (next.includeSold) params.set("sold", "1");
  if (next.sort !== "newest") params.set("sort", next.sort);
  if (next.q) params.set("q", next.q);
  if (next.page !== 1) params.set("page", String(next.page));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
