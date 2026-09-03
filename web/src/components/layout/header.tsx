import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";

export function Header() {
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const locale = useLocale();
  const otherLocale = locale === "ar" ? "en" : "ar";

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/coverage-areas", label: t("coverageAreas") },
    { href: "/store", label: t("store") },
    { href: "/partner", label: t("partner") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/img/logo/aldabouqi-logo.webp"
            alt={BUSINESS.nameAr}
            width={160}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            locale={otherLocale}
            className="hidden text-sm font-medium text-foreground/70 hover:text-primary sm:inline"
          >
            {t("switchLanguage")}
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            nativeButton={false}
            render={<a href={`tel:${BUSINESS.phoneE164}`} aria-label={cta("call")} />}
          >
            <Phone className="size-4" />
            {cta("call")}
          </Button>
          <Button
            size="sm"
            className="bg-[#25D366] text-white hover:bg-[#1ebe57]"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppLink(cta("whatsappDefaultMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={cta("whatsapp")}
              />
            }
          >
            <MessageCircle className="size-4" />
            {cta("whatsapp")}
          </Button>
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
