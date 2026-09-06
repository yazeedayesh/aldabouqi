"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { buildStoreQuery, type StoreFilters, type StoreSort } from "@/lib/store-query";

export function StoreSortSelect({
  filters,
  label,
  options,
}: {
  filters: StoreFilters;
  label: string;
  options: readonly { value: StoreSort; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[13.5px] text-muted-foreground">{label}</span>
      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => router.push(pathname + buildStoreQuery(filters, { sort: e.target.value as StoreSort }))}
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
