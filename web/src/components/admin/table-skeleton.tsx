export function TableSkeleton({ columns = 4, rows = 5 }: { columns?: number; rows?: number }) {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-background">
      <div className="border-b border-border bg-secondary/40 p-3">
        <div className="h-4 w-24 rounded bg-secondary" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border p-3 last:border-0">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 flex-1 rounded bg-secondary" style={{ maxWidth: j === 0 ? 48 : undefined }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="h-4 w-20 rounded bg-secondary" />
          <div className="mt-4 h-7 w-12 rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}
