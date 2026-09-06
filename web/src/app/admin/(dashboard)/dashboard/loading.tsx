import { StatCardsSkeleton, TableSkeleton } from "@/components/admin/table-skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-40 animate-pulse rounded bg-secondary" />
      <StatCardsSkeleton />
      <div className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border border-border bg-card" />
        <div className="space-y-8">
          <TableSkeleton columns={2} rows={5} />
          <TableSkeleton columns={2} rows={5} />
        </div>
      </div>
    </div>
  );
}
