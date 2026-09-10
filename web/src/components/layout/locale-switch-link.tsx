"use client";

import { Link, usePathname } from "@/i18n/navigation";

/**
 * Switches locale while staying on the current page (site owner request,
 * 2026-09-10: switching language used to always bounce back to "/"). The
 * header itself is a Server Component, so this one small piece needs to
 * be a client component to read the current pathname via next-intl's own
 * `usePathname`, which already strips the locale prefix and resolves
 * dynamic segments to their real values.
 */
export function LocaleSwitchLink({
  otherLocale,
  label,
  className,
}: {
  otherLocale: "ar" | "en";
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <Link href={pathname} locale={otherLocale} aria-label={label} className={className}>
      {label}
    </Link>
  );
}
