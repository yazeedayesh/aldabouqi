import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getAreaBySlug } from "./lib/areas";
import { getCachedProducts } from "./lib/store-data";
import { renderStoreUnavailableHtml } from "./lib/store-unavailable-html";
import type { NextRequest } from "next/server";

// Proxy (this file) always runs on the Node.js runtime, so it can safely
// use the same Drizzle client as the rest of the app below.
const intlMiddleware = createMiddleware(routing);

// /store and /store/{category} only — not checkout, not order-confirmation,
// and not product detail pages (/store/{category}/{slug}, two segments),
// none of which this fix touches.
const STORE_LISTING_PATTERN = /^(?:\/en)?\/store(?:\/(?!checkout$|order-confirmation(?:\/|$))[a-z0-9-]+)?\/?$/;

// Next.js Server Components can only set a handful of fixed status codes
// (notFound=404, forbidden=403, unauthorized=401, redirect=3xx) — there's
// no supported way for store/page.tsx itself to respond 503. Middleware is
// the one layer that can, so the health check happens here: on failure,
// short-circuit with a real 503 + Retry-After before the page (and its own
// React fallback, status 200 — see store/page.tsx) ever renders. Memoized
// per warm instance for STORE_HEALTH_TTL_MS so this doesn't become its own
// per-request DB hit — it calls the exact same cached getCachedProducts()
// the pages use, so on a healthy cache this never touches the DB either.
let storeHealth: { ok: boolean; checkedAt: number } = { ok: true, checkedAt: 0 };
const STORE_HEALTH_TTL_MS = 60_000;

async function isStoreDataHealthy(): Promise<boolean> {
  const now = Date.now();
  if (now - storeHealth.checkedAt < STORE_HEALTH_TTL_MS) return storeHealth.ok;
  try {
    await getCachedProducts();
    storeHealth = { ok: true, checkedAt: now };
  } catch {
    storeHealth = { ok: false, checkedAt: now };
  }
  return storeHealth.ok;
}

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

export default async function middleware(request: NextRequest) {
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

  if (STORE_LISTING_PATTERN.test(request.nextUrl.pathname)) {
    const healthy = await isStoreDataHealthy();
    if (!healthy) {
      const isEnglish = request.nextUrl.pathname.startsWith("/en");
      return new Response(renderStoreUnavailableHtml(isEnglish ? "en" : "ar"), {
        status: 503,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Retry-After": "120",
          "Cache-Control": "no-store",
        },
      });
    }
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
