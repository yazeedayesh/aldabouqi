import { ExternalLink } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

/** Shared 84px page header bar (admin v2 brief, 2026-09-08) — title +
 * subtitle on the start side, page-specific actions + a constant "عرض
 * الموقع" link on the end side, reused across every admin screen. */
export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-6 flex h-auto min-h-[84px] flex-wrap items-center justify-between gap-3 border-b border-admin-border bg-white px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div>
        <h1 className="font-heading text-[19px] font-extrabold tracking-tight text-foreground sm:text-[22px]">
          {title}
        </h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-admin-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2.5">
        {actions}
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-admin-input px-4 text-[13.5px] font-semibold text-admin-muted-2"
        >
          <ExternalLink className="size-4" />
          <span className="hidden sm:inline">عرض الموقع</span>
        </a>
      </div>
    </div>
  );
}
