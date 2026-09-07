"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/store/product-card";
import { StoreFilterRail } from "@/components/store/store-filter-rail";
import { StoreSortSelect } from "@/components/store/store-sort-select";
import { StorePagination } from "@/components/store/store-pagination";
import type { StoreFilters, StoreSort } from "@/lib/store-query";
import type { Product } from "@/db/schema";

type CategoryCount = { slug: string; name: string; count: number };
type ConditionCount = { value: "excellent" | "good" | "fair"; label: string; count: number };

export function StorePageContent({
  locale,
  pathname,
  activeCategorySlug,
  categories,
  products,
  totalCount,
  allCategoriesCount,
  totalPages,
  conditions,
  filters,
  priceBounds,
  content,
}: {
  locale: "ar" | "en";
  pathname: string;
  activeCategorySlug?: string;
  categories: CategoryCount[];
  products: Product[];
  totalCount: number;
  allCategoriesCount: number;
  totalPages: number;
  conditions: ConditionCount[];
  filters: StoreFilters;
  priceBounds: { min: number; max: number };
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
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const activeFilterCount = filters.conditions.length + (filters.minPrice != null || filters.maxPrice != null ? 1 : 0) + (filters.includeSold ? 1 : 0);
  const rangeStart = (filters.page - 1) * 12 + 1;
  const rangeEnd = Math.min(filters.page * 12, totalCount);
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c.name]));

  const railProps = {
    locale,
    activeCategorySlug,
    categories,
    allCategoriesCount,
    conditions,
    filters,
    priceBounds,
    content,
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
        {categories.map((cat) => (
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
              {content.resultsPrefix} <strong className="font-bold text-foreground">{totalCount > 0 ? `${rangeStart}–${rangeEnd}` : 0}</strong>{" "}
              {content.resultsOf} <strong className="font-bold text-foreground">{totalCount}</strong> {content.resultsUnit}
            </p>
            <StoreSortSelect filters={filters} label={content.sortLabel} options={content.sortOptions} />
          </div>

          {products.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">{content.empty}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categoryBySlug.get(product.category) ?? ""}
                  locale={locale}
                  delayMs={(i % 6) * 90}
                  noPhotoLabel={content.noPhotoYet}
                  priceOnRequestLabel={content.priceOnRequest}
                />
              ))}
            </div>
          )}

          <StorePagination pathname={pathname} filters={filters} totalPages={totalPages} />
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
