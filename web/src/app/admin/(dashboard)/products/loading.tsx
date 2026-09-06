import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="h-8 w-28 animate-pulse rounded bg-secondary" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-secondary" />
      </div>
      <div className="mt-6">
        <TableSkeleton columns={4} />
      </div>
    </div>
  );
}
