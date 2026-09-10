import { getLocale, getTranslations } from "next-intl/server";
import { and, count, eq } from "drizzle-orm";
import { MessageCircle, Phone, Store } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SiteLogo } from "@/components/layout/site-logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LocaleSwitchLink } from "@/components/layout/locale-switch-link";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";

/**
 * Floating pill nav (v2 identity brief, 2026-09-07) — replaces the earlier
 * full-width bordered sticky bar. Home and Store are deliberately not in the
 * inline text-link list: home is implied by the logo, and Store gets its
 * own colored pill since it's the primary conversion path off the header.
 */
export async function Header() {
  const [t, cta, locale] = await Promise.all([
    getTranslations("nav"),
    getTranslations("cta"),
    getLocale(),
  ]);
  const otherLocale = locale === "en" ? "ar" : "en";
  const otherLocaleShortLabel = otherLocale === "en" ? "EN" : "AR";

  const [{ value: storeCount }] = await getDb()
    .select({ value: count() })
    .from(products)
    .where(and(eq(products.status, "available"), eq(products.visibility, "published")));

  const navLinks = [
    { href: "/about" as const, label: t("about") },
    { href: "/services" as const, label: t("services") },
    { href: "/coverage-areas" as const, label: t("coverageAreas") },
    { href: "/partner" as const, label: t("partner") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-4 rounded-full bg-card pe-2 ps-4 shadow-[0_2px_4px_rgba(16,16,18,.04),0_12px_32px_-12px_rgba(16,16,18,.12)] sm:h-17 sm:pe-2 sm:ps-6">
        <SiteLogo priority imgClassName="h-7 w-auto sm:h-[34px]" />

        <nav aria-label={t("home")} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <LocaleSwitchLink
            otherLocale={otherLocale}
            label={otherLocaleShortLabel}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border text-[11.5px] font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:hidden"
          />
          <LocaleSwitchLink
            otherLocale={otherLocale}
            label={otherLocaleShortLabel}
            className="hidden text-[13px] font-bold text-muted-foreground hover:text-primary sm:inline"
          />
          <Link
            href="/store"
            aria-label={t("store")}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 text-[13.5px] font-bold text-primary-foreground transition-colors hover:bg-primary-dark sm:h-12 sm:px-5 sm:text-sm"
          >
            <Store className="size-4" strokeWidth={2} />
            <span className="hidden sm:inline">{t("store")}</span>
          </Link>
          <a
            href={buildWhatsAppLink(cta("whatsappDefaultMessage"))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={cta("whatsapp")}
            className="hidden h-12 shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-bold text-ink-foreground transition-colors hover:bg-ink/90 sm:flex"
          >
            <MessageCircle className="size-4" strokeWidth={2} />
            {cta("whatsapp")}
          </a>
          <a
            href={`tel:${BUSINESS.phoneE164}`}
            aria-label={cta("call")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border text-foreground transition-colors hover:border-primary hover:text-primary sm:size-12"
          >
            <Phone className="size-4 sm:size-[18px]" strokeWidth={1.8} />
          </a>
          <MobileNav storeCount={storeCount} />
        </div>
      </div>
    </header>
  );
}
