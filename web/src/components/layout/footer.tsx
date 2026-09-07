import { asc } from "drizzle-orm";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteLogo } from "@/components/layout/site-logo";
import { getDb } from "@/db";
import { categories as categoriesTable } from "@/db/schema";
import { BUSINESS } from "@/lib/constants";
import { FacebookIcon, InstagramIcon, XIcon } from "./social-icons";

/**
 * v2 identity (2026-09-07): a white rounded panel floating on the page
 * background, matching the reference exactly — not a full-bleed dark bar
 * like the earlier design (site owner confirmed following the mockup
 * literally over the brief's own prose, which had assumed a dark footer).
 * The category column is DB-driven (first 5 by sortOrder) rather than the
 * mockup's static 5 example names, so the links stay real as categories
 * change instead of drifting from actual store data.
 */
export async function Footer() {
  const [t, nav, locale] = await Promise.all([
    getTranslations("footer"),
    getTranslations("nav"),
    getLocale(),
  ]);

  const categoryRows = await getDb()
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.sortOrder))
    .limit(5);

  const quickLinks = [
    { href: "/" as const, label: nav("home") },
    { href: "/about" as const, label: nav("about") },
    { href: "/services" as const, label: nav("services") },
    { href: "/coverage-areas" as const, label: nav("coverageAreas") },
    { href: "/store" as const, label: nav("store") },
  ];

  return (
    <footer className="px-3 pb-8 pt-19 sm:px-5">
      <div className="mx-auto max-w-7xl rounded-3xl bg-card px-6 pb-8 pt-12 sm:rounded-[40px] sm:px-13 sm:pt-12">
        <div className="grid gap-10 pb-10 sm:grid-cols-2 sm:border-b sm:border-border lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <SiteLogo imgClassName="h-10 w-auto" />
            <p className="max-w-sm text-[14.5px] leading-relaxed text-muted-foreground">{t("tagline")}</p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={BUSINESS.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-[42px] items-center justify-center rounded-full bg-secondary text-foreground hover:text-primary"
              >
                <FacebookIcon className="size-[17px]" />
              </a>
              <a
                href={BUSINESS.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-[42px] items-center justify-center rounded-full bg-secondary text-foreground hover:text-primary"
              >
                <InstagramIcon className="size-[17px]" />
              </a>
              <a
                href={BUSINESS.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex size-[42px] items-center justify-center rounded-full bg-secondary text-foreground hover:text-primary"
              >
                <XIcon className="size-[17px]" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-[18px] font-heading text-[15px] font-extrabold text-foreground">{t("quickLinks")}</h3>
            <ul className="space-y-3 text-[14.5px] text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-[18px] font-heading text-[15px] font-extrabold text-foreground">
              {locale === "en" ? "Categories" : "الأقسام"}
            </h3>
            <ul className="space-y-3 text-[14.5px] text-muted-foreground">
              {categoryRows.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/store/${cat.slug}`} className="hover:text-primary">
                    {locale === "en" ? cat.nameEn : cat.nameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-[18px] font-heading text-[15px] font-extrabold text-foreground">{t("contactUs")}</h3>
            <ul className="space-y-3 text-[14.5px] text-muted-foreground">
              <li>
                <a href={`tel:${BUSINESS.phoneE164}`} dir="ltr" className="hover:text-primary">
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary">
                  {BUSINESS.email}
                </a>
              </li>
              <li>{locale === "en" ? "All areas of Amman" : "جميع مناطق عمان"}</li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary">
                  {nav("privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 text-center text-[13.5px] text-muted-foreground">
          © {new Date().getFullYear()} {BUSINESS.nameAr} — {t("rights")}
        </div>
      </div>
    </footer>
  );
}
