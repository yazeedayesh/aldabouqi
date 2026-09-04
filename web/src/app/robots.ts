import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Mirrors the current site's robots.txt rules (User-agent blocks for
// MJ12bot, crawl-delay hints for Googlebot/Bingbot/Ahrefs/Semrush), adapted
// for routes that don't exist on the old static site (/admin, /api).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Googlebot", allow: "/", crawlDelay: 5 },
      { userAgent: "Bingbot", allow: "/", crawlDelay: 5 },
      { userAgent: "MJ12bot", disallow: "/" },
      { userAgent: "AhrefsBot", allow: "/", crawlDelay: 30 },
      { userAgent: "SemrushBot", allow: "/", crawlDelay: 30 },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
