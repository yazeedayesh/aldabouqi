"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StoreFilters } from "@/lib/store-query";
import { cn } from "@/lib/utils";

export function StorePagination({
  filters,
  totalPages,
  onApply,
}: {
  filters: StoreFilters;
  totalPages: number;
  /** Applies a page change to the in-memory product list — no navigation, no DB hit (see StorePageContent). */
  onApply: (overrides: Partial<StoreFilters>) => void;
}) {
  if (totalPages <= 1) return null;

  const page = filters.page;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <PageArrow
        disabled={page <= 1}
        onClick={() => onApply({ page: page - 1 })}
        icon={<ChevronRight className="size-4" strokeWidth={1.7} />}
      />
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onApply({ page: p })}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex size-10 items-center justify-center rounded-[10px] text-sm font-semibold",
            p === page ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
          )}
        >
          {p}
        </button>
      ))}
      <PageArrow
        disabled={page >= totalPages}
        onClick={() => onApply({ page: page + 1 })}
        icon={<ChevronLeft className="size-4" strokeWidth={1.7} />}
      />
    </nav>
  );
}

function PageArrow({ disabled, onClick, icon }: { disabled: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-10 items-center justify-center rounded-[10px] border border-border",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {icon}
    </button>
  );
}
