import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function Loading() {
  return (
    <div>
      <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
      <div className="mt-6">
        <TableSkeleton columns={5} />
      </div>
    </div>
  );
}
