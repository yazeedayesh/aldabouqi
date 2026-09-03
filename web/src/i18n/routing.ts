import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Arabic (default) has no URL prefix, English is prefixed with /en —
  // this matches the current site's URL scheme exactly.
  localePrefix: "as-needed",
  // The current site always serves Arabic at "/" regardless of the
  // visitor's browser language (there's no such redirect today). Disable
  // next-intl's Accept-Language negotiation so that behavior doesn't change.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
