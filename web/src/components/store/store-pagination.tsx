import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildStoreQuery, type StoreFilters } from "@/lib/store-query";
import { cn } from "@/lib/utils";

export function StorePagination({
  pathname,
  filters,
  totalPages,
}: {
  pathname: string;
  filters: StoreFilters;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const page = filters.page;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <PageArrow
        href={page > 1 ? pathname + buildStoreQuery(filters, { page: page - 1 }) : undefined}
        icon={<ChevronRight className="size-4" strokeWidth={1.7} />}
      />
      {pages.map((p) => (
        <Link
          key={p}
          href={pathname + buildStoreQuery(filters, { page: p })}
          className={cn(
            "flex size-10 items-center justify-center rounded-[10px] text-sm font-semibold",
            p === page ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
          )}
        >
          {p}
        </Link>
      ))}
      <PageArrow
        href={page < totalPages ? pathname + buildStoreQuery(filters, { page: page + 1 }) : undefined}
        icon={<ChevronLeft className="size-4" strokeWidth={1.7} />}
      />
    </nav>
  );
}

function PageArrow({ href, icon }: { href?: string; icon: React.ReactNode }) {
  const className = cn(
    "flex size-10 items-center justify-center rounded-[10px] border border-border",
    !href && "pointer-events-none opacity-40"
  );
  if (!href) return <span className={className}>{icon}</span>;
  return (
    <Link href={href} className={className}>
      {icon}
    </Link>
  );
}
