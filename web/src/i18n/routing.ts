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
  // Every page already sets correct hreflang via buildMetadata() (real
  // <link> tags, using the canonical www domain and the public
  // /buy-used-furniture-* paths for area pages). The middleware's own
  // automatic `Link` response header duplicated this using the request's
  // bare-domain host and the *internal* /areas/[area] path — a second,
  // conflicting hreflang declaration for the same language on the same
  // page. An SEO crawl flagged this site-wide (site owner, 2026-09-11):
  // "Hreflang: Multiple Entries" on ~71% of pages, plus knock-on
  // "Not Using Canonical" and "Non-200" findings from the mismatched
  // domain. Disabled rather than reconciled, since the HTML tags already
  // do this job correctly.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
