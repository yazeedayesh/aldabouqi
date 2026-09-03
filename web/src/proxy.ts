import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, admin (locale-independent), Next internals, and any
  // request for a file with an extension (static assets).
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
