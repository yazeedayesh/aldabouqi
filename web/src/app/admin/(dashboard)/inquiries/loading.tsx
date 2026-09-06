import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function Loading() {
  return (
    <div>
      <div className="h-8 w-40 animate-pulse rounded bg-secondary" />
      <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-secondary" />
      <div className="mt-6">
        <TableSkeleton columns={2} />
      </div>
    </div>
  );
}
