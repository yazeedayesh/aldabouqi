import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Home, MessageCircle, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    eyebrow: "خطأ 404",
    title: "هاي الصفحة مش موجودة",
    subtitle: "يمكن الرابط قديم أو مكتوب غلط — بس الموقع شغال تمام، جرّب أحد الروابط تحت.",
    home: "الصفحة الرئيسية",
    whatsapp: "تواصل معنا",
    whatsappMessage: "وصلتني صفحة غير موجودة بالموقع",
    quickLinksTitle: "روابط سريعة",
    links: [
      { href: "/store", label: "المتجر" },
      { href: "/services", label: "خدماتنا" },
      { href: "/coverage-areas", label: "مناطق التغطية" },
      { href: "/contact", label: "اتصل بنا" },
    ],
  },
  en: {
    eyebrow: "Error 404",
    title: "This page doesn't exist",
    subtitle: "The link might be old or mistyped — the rest of the site is working fine, try one of these instead.",
    home: "Go to Homepage",
    whatsapp: "Contact Us",
    whatsappMessage: "I landed on a missing page on your website",
    quickLinksTitle: "Quick Links",
    links: [
      { href: "/store", label: "Store" },
      { href: "/services", label: "Our Services" },
      { href: "/coverage-areas", label: "Coverage Areas" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return {
    title: locale === "en" ? "Page Not Found" : "الصفحة غير موجودة",
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const c = content[locale] ?? content.ar;

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <p className="rise mb-3 text-sm font-bold tracking-widest text-primary uppercase">{c.eyebrow}</p>
        <h1 className="rise d1 shine font-heading text-[88px] leading-none font-extrabold sm:text-[120px]">
          404
        </h1>
        <h2 className="rise d2 mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {c.title}
        </h2>
        <p className="rise d3 mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          {c.subtitle}
        </p>

        <div className="rise d4 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/" />}>
            <Home className="size-4" />
            {c.home}
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={
              <a href={buildWhatsAppLink(c.whatsappMessage)} target="_blank" rel="noopener noreferrer" />
            }
          >
            <MessageCircle className="size-4" />
            {c.whatsapp}
          </Button>
        </div>

        <div className="rise d5 mt-12 border-t border-border pt-8">
          <p className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
            <Search className="size-4" />
            {c.quickLinksTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {c.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
