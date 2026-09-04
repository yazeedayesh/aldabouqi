import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Bare /admin previously had no matching page — Next's not-found fallback
// then mistakenly rendered [locale]/page.tsx with no locale param and
// crashed (500), since /admin is deliberately excluded from the next-intl
// middleware (see proxy.ts) and isn't part of the [locale] tree at all.
export default async function AdminIndexPage() {
  const session = await auth();
  redirect(session ? "/admin/products" : "/admin/login");
}
