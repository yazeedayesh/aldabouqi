import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

// Without this catch-all, a URL that doesn't match any real page (a typo,
// an old deleted link, a bot probe) never "enters" the [locale] segment at
// all as far as the router is concerned, so it skips straight past
// `[locale]/not-found.tsx` to the locale-less root fallback instead —
// found while adding a custom 404 page (site owner report, 2026-09-10).
export default async function CatchAll({ params }: PageProps<"/[locale]/[...rest]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  notFound();
}
