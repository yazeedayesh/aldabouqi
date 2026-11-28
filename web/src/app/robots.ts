import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Mirrors the current site's robots.txt rules (User-agent blocks for
// MJ12bot, crawl-delay hints for Googlebot/Bingbot/Ahrefs/Semrush), adapted
// for routes that don't exist on the old static site (/admin, /api).
// Query-string store URLs (?condition=, ?minPrice=, ?page=, etc.) are now
// purely client-side filtering state on top of the one cached, canonical
// page per category (store/[category]/page.tsx no longer reads
// searchParams at all — see that file's own comment) — they render
// identical HTML to the bare URL until JS reads the query string, so
// there's nothing distinct for a crawler to index there, and the bare URL
// is what every page's own canonical tag already points at regardless of
// query string (lib/seo.ts's buildMetadata is only ever called with the
// static path, never searchParams).
const STORE_QUERY_PARAM_DISALLOW = ["/store?*", "/store/*?*", "/en/store?*", "/en/store/*?*"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", ...STORE_QUERY_PARAM_DISALLOW] },
      { userAgent: "Googlebot", allow: "/", disallow: STORE_QUERY_PARAM_DISALLOW, crawlDelay: 5 },
      { userAgent: "Bingbot", allow: "/", disallow: STORE_QUERY_PARAM_DISALLOW, crawlDelay: 5 },
      { userAgent: "MJ12bot", disallow: "/" },
      { userAgent: "AhrefsBot", allow: "/", disallow: STORE_QUERY_PARAM_DISALLOW, crawlDelay: 30 },
      { userAgent: "SemrushBot", allow: "/", disallow: STORE_QUERY_PARAM_DISALLOW, crawlDelay: 30 },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
