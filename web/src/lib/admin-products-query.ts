export type AdminProductSort = "newest" | "cheapest" | "priciest";

export type AdminProductFilters = {
  q?: string;
  category?: string;
  visibility?: "published" | "hidden" | "draft";
  sort: AdminProductSort;
  page: number;
};

export const ADMIN_PAGE_SIZE = 20;

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseAdminProductFilters(searchParams: SearchParams): AdminProductFilters {
  const sortRaw = first(searchParams.sort);
  const sort: AdminProductSort = sortRaw === "cheapest" || sortRaw === "priciest" ? sortRaw : "newest";
  const pageRaw = Number(first(searchParams.page));
  const visibilityRaw = first(searchParams.visibility);

  return {
    q: first(searchParams.q)?.trim() || undefined,
    category: first(searchParams.category) || undefined,
    visibility:
      visibilityRaw === "published" || visibilityRaw === "hidden" || visibilityRaw === "draft"
        ? visibilityRaw
        : undefined,
    sort,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1,
  };
}

export function buildAdminProductQuery(filters: AdminProductFilters, overrides: Partial<AdminProductFilters>): string {
  const next = { ...filters, ...overrides };
  if (!("page" in overrides)) next.page = 1;

  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.category) params.set("category", next.category);
  if (next.visibility) params.set("visibility", next.visibility);
  if (next.sort !== "newest") params.set("sort", next.sort);
  if (next.page !== 1) params.set("page", String(next.page));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
