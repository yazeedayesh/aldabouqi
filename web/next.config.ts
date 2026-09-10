import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Product photos uploaded via /admin, stored in Vercel Blob.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  // Baseline security headers — an SEO/security crawl flagged these
  // missing site-wide (site owner, 2026-09-11). CSP is deliberately not
  // set here: a strict policy needs auditing every inline script/external
  // origin actually in use (GA4, Meta Pixel, Formspree, embedded map,
  // etc.) to avoid silently breaking them, which is a separate pass.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
