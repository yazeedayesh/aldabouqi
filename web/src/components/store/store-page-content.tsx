"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/store/product-card";
import { StoreFilterRail } from "@/components/store/store-filter-rail";
import { StoreSortSelect } from "@/components/store/store-sort-select";
import { StorePagination } from "@/components/store/store-pagination";
import {
  buildStoreQuery,
  buildStoreView,
  mergeStoreFilters,
  parseStoreFilters,
  type StoreFilters,
  type StoreSort,
} from "@/lib/store-query";
import type { StoreListingProduct } from "@/lib/store-data";

type CategoryRow = { slug: string; nameAr: string; nameEn: string };

// history.pushState/replaceState fire no event of their own, so applyFilters
// dispatches this manually right after writing the URL — that's what lets
// useSyncExternalStore below know a change happened, on top of the real
// popstate event (back/forward, or someone editing the address bar).
const STORE_FILTERS_CHANGED_EVENT = "store-filters-changed";

function subscribeToLocationSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(STORE_FILTERS_CHANGED_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(STORE_FILTERS_CHANGED_EVENT, callback);
  };
}

function getLocationSearch() {
  return window.location.search;
}

// The server always renders as if there were no query string at all — it
// never reads searchParams (that's what keeps this page static/ISR instead
// of forced-dynamic) — so this is what hydration compares against. Once
// mounted, useSyncExternalStore immediately re-reads the real
// window.location.search below and re-renders with the actual filters —
// the React-sanctioned way to sync with an external, un-ownable source
// like the URL after hydration, instead of a useEffect+setState that lints
// as "set state in effect" (see price-range-slider.tsx for the same
// pattern done the old way, left as-is).
function getServerLocationSearch() {
  return "";
}

/**
 * Owns all filtering/sorting/pagination state client-side (lib/store-query.ts's
 * buildStoreView, run against the full cached catalog passed in as
 * `allProducts`) instead of the server re-querying per searchParams change —
 * that's what lets /store and /store/[category] stay static/ISR. `filters`
 * is derived from the real URL via useSyncExternalStore (see above) rather
 * than server props, so a shared/bookmarked filtered link (?minPrice=50
 * etc.) takes effect right after hydration.
 */
export function StorePageContent({
  locale,
  activeCategorySlug,
  categories,
  allProducts,
  defaultPhoneE164,
  content,
  conditionLabels,
}: {
  locale: "ar" | "en";
  activeCategorySlug?: string;
  /** Non-hidden categories only — same scope the old server-side query used. */
  categories: CategoryRow[];
  /** The full published catalog (every category, every status) — see buildStoreView. */
  allProducts: StoreListingProduct[];
  defaultPhoneE164: string;
  content: {
    categoriesTitle: string;
    allCategories: string;
    conditionTitle: string;
    priceTitle: string;
    from: string;
    to: string;
    availabilityTitle: string;
    availableOnly: string;
    includeSold: string;
    sellTitle: string;
    sellBody: string;
    sellCta: string;
    filterButton: string;
    resultsPrefix: string;
    resultsOf: string;
    resultsUnit: string;
    sortLabel: string;
    sortOptions: readonly { value: StoreSort; label: string }[];
    empty: string;
    noPhotoYet: string;
    priceOnRequest: string;
  };
  conditionLabels: Record<"excellent" | "good" | "fair", string>;
}) {
  const [filterOpen, setFilterOpen] = useState(false);

  const locationSearch = useSyncExternalStore(subscribeToLocationSearch, getLocationSearch, getServerLocationSearch);
  const filters = useMemo(
    () => parseStoreFilters(Object.fromEntries(new URLSearchParams(locationSearch).entries())),
    [locationSearch]
  );

  function applyFilters(overrides: Partial<StoreFilters>) {
    const next = mergeStoreFilters(filters, overrides);
    window.history.replaceState(null, "", window.location.pathname + buildStoreQuery(next));
    window.dispatchEvent(new Event(STORE_FILTERS_CHANGED_EVENT));
  }

  const view = useMemo(
    () => buildStoreView(allProducts, activeCategorySlug, filters),
    [allProducts, activeCategorySlug, filters]
  );

  const activeFilterCount =
    filters.conditions.length + (filters.minPrice != null || filters.maxPrice != null ? 1 : 0) + (filters.includeSold ? 1 : 0);
  const rangeStart = (filters.page - 1) * 12 + 1;
  const rangeEnd = Math.min(filters.page * 12, view.totalCount);

  const categoriesWithCounts = categories.map((cat) => ({
    slug: cat.slug,
    name: locale === "en" ? cat.nameEn : cat.nameAr,
    count: view.countByCategory.get(cat.slug) ?? 0,
  }));
  const categoryBySlug = new Map(categoriesWithCounts.map((c) => [c.slug, c.name]));

  const conditions = (["excellent", "good", "fair"] as const).map((value) => ({
    value,
    label: conditionLabels[value],
    count: view.countByCondition.get(value) ?? 0,
  }));

  const railProps = {
    locale,
    activeCategorySlug,
    categories: categoriesWithCounts,
    allCategoriesCount: view.baseTotalCount,
    conditions,
    filters,
    priceBounds: view.priceBounds,
    content,
    onApply: applyFilters,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      {/* Mobile: horizontal category chips + filter button */}
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto border-b border-border px-4 pb-3.5 sm:-mx-6 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[13.5px] font-bold text-ink-foreground"
        >
          <SlidersHorizontal className="size-4" strokeWidth={1.8} />
          {content.filterButton}
          {activeFilterCount > 0 && (
            <span className="flex size-[18px] items-center justify-center rounded-full bg-primary text-[11px]">
              {activeFilterCount}
            </span>
          )}
        </button>
        <Link
          href="/store"
          className={`flex h-10 shrink-0 items-center rounded-full px-3.5 text-[13.5px] font-bold ${!activeCategorySlug ? "bg-accent text-primary-dark" : "border border-border text-muted-foreground"}`}
        >
          {content.allCategories}
        </Link>
        {categoriesWithCounts.map((cat) => (
          <Link
            key={cat.slug}
            href={`/store/${cat.slug}`}
            className={`flex h-10 shrink-0 items-center rounded-full px-3.5 text-[13.5px] ${activeCategorySlug === cat.slug ? "bg-accent font-bold text-primary-dark" : "border border-border text-muted-foreground"}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[268px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <StoreFilterRail {...railProps} />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {content.resultsPrefix}{" "}
              <strong className="font-bold text-foreground">{view.totalCount > 0 ? `${rangeStart}–${rangeEnd}` : 0}</strong>{" "}
              {content.resultsOf} <strong className="font-bold text-foreground">{view.totalCount}</strong> {content.resultsUnit}
            </p>
            <StoreSortSelect filters={filters} label={content.sortLabel} options={content.sortOptions} onApply={applyFilters} />
          </div>

          {view.products.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">{content.empty}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {view.products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categoryBySlug.get(product.category) ?? ""}
                  locale={locale}
                  delayMs={(i % 6) * 90}
                  noPhotoLabel={content.noPhotoYet}
                  priceOnRequestLabel={content.priceOnRequest}
                  callPhoneE164={defaultPhoneE164}
                />
              ))}
            </div>
          )}

          <StorePagination filters={filters} totalPages={view.totalPages} onApply={applyFilters} />
        </div>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>{content.filterButton}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <StoreFilterRail {...railProps} onNavigate={() => setFilterOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
