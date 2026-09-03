import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getAreaBySlug } from "./lib/areas";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Next.js dynamic route segments can't mix a literal prefix with a bracket
// inside one folder name — a folder like "buy-used-furniture-[area]" is
// treated as a literal, non-dynamic path (confirmed empirically: it built
// as a static "○" route, not a per-param SSG one, and every real slug
// 404'd). The actual page lives at the internal path /areas/[area]; this
// rewrites the public URL to that internal path before next-intl's own
// locale routing runs, so the /ar prefix it adds internally still resolves
// against the real file-system route.
const AREA_URL_PATTERN = /^\/buy-used-furniture-([a-z0-9-]+)$/;

export default function middleware(request: NextRequest) {
  const match = AREA_URL_PATTERN.exec(request.nextUrl.pathname);
  if (match && getAreaBySlug(match[1])) {
    request.nextUrl.pathname = `/areas/${match[1]}`;
  }
  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, admin (locale-independent), Next internals, and any
  // request for a file with an extension (static assets).
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
