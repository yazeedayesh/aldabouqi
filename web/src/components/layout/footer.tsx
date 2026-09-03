import { useTranslations } from "next-intl";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BUSINESS } from "@/lib/constants";
import { FacebookIcon, InstagramIcon, XIcon } from "./social-icons";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const links = [
    { href: "/", label: nav("home") },
    { href: "/about", label: nav("about") },
    { href: "/services", label: nav("services") },
    { href: "/coverage-areas", label: nav("coverageAreas") },
    { href: "/store", label: nav("store") },
    { href: "/privacy-policy", label: nav("privacyPolicy") },
  ] as const;

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <Image
            src="/img/logo/aldabouqi-logo.webp"
            alt={BUSINESS.nameAr}
            width={160}
            height={48}
            className="h-10 w-auto"
          />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("tagline")}
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href={BUSINESS.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-primary"
            >
              <FacebookIcon className="size-5" />
            </a>
            <a
              href={BUSINESS.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={BUSINESS.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-muted-foreground hover:text-primary"
            >
              <XIcon className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            {t("quickLinks")}
          </h3>
          <ul className="space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            {t("contactUs")}
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${BUSINESS.phoneE164}`} dir="ltr" className="hover:text-primary">
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary">
                {BUSINESS.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span>{BUSINESS.address.streetAddressAr}، {BUSINESS.address.localityAr}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BUSINESS.nameAr} — {t("rights")}
      </div>
    </footer>
  );
}
