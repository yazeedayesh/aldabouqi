"use client";

import { ChevronDown } from "lucide-react";
import type { StoreFilters, StoreSort } from "@/lib/store-query";

export function StoreSortSelect({
  filters,
  label,
  options,
  onApply,
}: {
  filters: StoreFilters;
  label: string;
  options: readonly { value: StoreSort; label: string }[];
  /** Applies a sort change to the in-memory product list — no navigation, no DB hit (see StorePageContent). */
  onApply: (overrides: Partial<StoreFilters>) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[13.5px] text-muted-foreground">{label}</span>
      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => onApply({ sort: e.target.value as StoreSort })}
          className="h-10 min-w-[180px] appearance-none rounded-[10px] border border-border bg-card px-3.5 pe-9 text-sm font-semibold"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
