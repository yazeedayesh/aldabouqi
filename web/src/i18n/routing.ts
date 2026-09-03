import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Arabic (default) has no URL prefix, English is prefixed with /en —
  // this matches the current site's URL scheme exactly.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
