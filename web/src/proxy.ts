import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getAreaBySlug } from "./lib/areas";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Next.js dynamic route segments can't mix a literal prefix with a bracket
// inside one folder name — a folder like "buy-used-furniture-[area]" is
// treated as a literal, non-dynamic path (confirmed empirically: it built
// as a static "○" route, not a per-param SSG one, and every real slug
// 404'd). The actual page lives at the internal path /areas/[area]; this
// rewrites the public URL to that internal path, with an explicit locale
// segment always spelled out (both "/en" and the unprefixed default "ar"
// case). The English variant now has real content (site owner request,
// 2026-09-10), hence the optional "/en" prefix.
//
// Rewritten directly with NextResponse.rewrite rather than mutating
// request.nextUrl.pathname and delegating to intlMiddleware: for ar,
// intlMiddleware needs to ADD a prefix, so it emits a real
// x-middleware-rewrite header — but for en, a pre-mutated pathname
// already matches what it considers canonical, so it just calls next()
// on the ORIGINAL unrewritten request, which 404s (confirmed empirically:
// the x-middleware-rewrite header is present for ar, absent for en).
// Issuing the rewrite ourselves sidesteps that asymmetry entirely.
const AREA_URL_PATTERN = /^(\/en)?\/buy-used-furniture-([a-z0-9-]+)$/;

export default function middleware(request: NextRequest) {
  // Canonical domain is www (SITE_URL) — both aldabouqi.com and
  // www.aldabouqi.com serve the site independently otherwise, which an
  // SEO crawl flagged as duplicate-domain content (site owner,
  // 2026-09-11). A vercel.json `has: [{type: "host", ...}]` redirect
  // didn't take effect (confirmed empirically against the live domain,
  // cache-busted), so handled here instead, where it's guaranteed to run.
  if (request.nextUrl.hostname === "aldabouqi.com") {
    const url = request.nextUrl.clone();
    url.hostname = "www.aldabouqi.com";
    return NextResponse.redirect(url, 308);
  }

  const match = AREA_URL_PATTERN.exec(request.nextUrl.pathname);
  if (match && getAreaBySlug(match[2])) {
    const url = request.nextUrl.clone();
    url.pathname = `/${match[1] ? "en" : "ar"}/areas/${match[2]}`;
    return NextResponse.rewrite(url);
  }
  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, admin (locale-independent), Next internals, and any
  // request for a file with an extension (static assets).
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
