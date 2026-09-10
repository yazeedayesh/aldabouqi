"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, MessageCircle, Phone, X } from "lucide-react";
import { Menu as MenuIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { SiteLogo } from "@/components/layout/site-logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { areas } from "@/lib/areas";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";

/**
 * Full-screen dark mobile menu (v2 identity brief, 2026-09-07) — replaces
 * the earlier partial-width drawer. Base UI's Dialog (under Sheet) already
 * provides the focus trap, focus-return-to-trigger, Esc-to-close,
 * outside-click-to-close, and body-scroll-lock this needs; this component
 * only supplies the full-screen dark layout and the link list itself, which
 * has its own fixed order and per-item badges (real store count, area
 * count) that don't match the desktop header's generic `links` prop, so it
 * isn't reused here.
 */
export function MobileNav({ storeCount }: { storeCount: number }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const locale = useLocale();
  const pathname = usePathname();

  const rows = [
    { href: "/" as const, label: t("home") },
    { href: "/store" as const, label: t("store"), variant: "store" as const },
    { href: "/about" as const, label: t("about") },
    { href: "/services" as const, label: t("services") },
    { href: "/coverage-areas" as const, label: t("coverageAreas"), variant: "areas" as const },
    { href: "/partner" as const, label: t("partner") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label={t("openMenu")}
            className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent lg:hidden"
          />
        }
      >
        <MenuIcon className="size-5" strokeWidth={1.8} />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full max-w-none border-none bg-ink p-0 text-ink-foreground sm:max-w-none"
      >
        <SheetTitle className="sr-only">{t("home")}</SheetTitle>

        {/* Scrollable region — everything except the sticky bottom CTAs, so
            the WhatsApp/call buttons stay visible on short viewports instead
            of being pushed off-screen by a long link list (brief §5: "ثابتين
            بأسفل القائمة دايمًا ظاهرين"). */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-5 pt-4">
            <SiteLogo variant="white" imgClassName="h-6 w-auto" />
            <SheetClose
              render={
                <button
                  type="button"
                  aria-label={t("closeMenu")}
                  className="flex size-10 items-center justify-center rounded-full bg-white/10 text-ink-foreground transition-colors hover:bg-white/15"
                />
              }
            >
              <X className="size-[18px]" strokeWidth={2.2} />
            </SheetClose>
          </div>

          <nav aria-label={t("home")} className="flex flex-col px-5 pt-3">
            {rows.map((row) => (
              <Link
                key={row.href}
                href={row.href}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-between border-b border-ink-border last:border-b-0"
              >
                <span
                  className={
                    "font-heading text-lg font-extrabold " +
                    (row.variant === "store" ? "text-vivid" : "text-ink-foreground")
                  }
                >
                  {row.label}
                </span>
                {row.variant === "store" ? (
                  <span className="flex h-6 items-center rounded-full bg-vivid/16 px-2.5 text-[11px] font-bold text-vivid">
                    {storeCount} {locale === "en" ? "items" : "قطعة"}
                  </span>
                ) : row.variant === "areas" ? (
                  <span className="text-[12px] text-ink-muted">
                    {areas.length} {locale === "en" ? "areas" : "منطقة"}
                  </span>
                ) : (
                  <ChevronLeft className="size-4.5 text-ink-muted rtl:rotate-0 ltr:rotate-180" />
                )}
              </Link>
            ))}
          </nav>

          <div className="px-5 pt-3">
            <div className="flex h-10 items-center rounded-full bg-white/7 p-[4px]">
              <Link
                href={pathname}
                locale="ar"
                onClick={() => setOpen(false)}
                className={
                  "flex h-full flex-1 items-center justify-center rounded-full text-[13.5px] font-bold transition-colors " +
                  (locale === "ar" ? "bg-white text-ink" : "text-ink-foreground/60")
                }
              >
                العربية
              </Link>
              <Link
                href={pathname}
                locale="en"
                onClick={() => setOpen(false)}
                className={
                  "flex h-full flex-1 items-center justify-center rounded-full text-[13.5px] font-semibold transition-colors " +
                  (locale === "en" ? "bg-white text-ink" : "text-ink-foreground/60")
                }
              >
                English
              </Link>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 px-5 pt-3 pb-4">
          <a
            href={buildWhatsAppLink(cta("whatsappDefaultMessage"))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex h-13 items-center justify-center gap-2.5 rounded-full bg-whatsapp text-[15px] font-extrabold text-whatsapp-foreground"
          >
            <MessageCircle className="size-[19px]" strokeWidth={2} />
            {cta("whatsapp")}
          </a>
          <a
            href={`tel:${BUSINESS.phoneE164}`}
            dir="ltr"
            onClick={() => setOpen(false)}
            className="flex h-12 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-white/26 text-[15px] font-bold text-ink-foreground"
          >
            <Phone className="size-[18px]" strokeWidth={1.8} />
            {BUSINESS.phoneDisplay}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
