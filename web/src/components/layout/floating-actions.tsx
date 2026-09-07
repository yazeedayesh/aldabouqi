"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

const content = {
  ar: { call: "اتصل بنا", whatsapp: "تواصل عبر واتساب", message: "مرحباً، أرغب بالاستفسار" },
  en: { call: "Call us", whatsapp: "Chat on WhatsApp", message: "Hi, I'd like to ask about your services" },
} as const;

const BACK_TO_TOP_THRESHOLD = 600;

/** /store/{category}/{slug} — the one page with its own fixed bottom action
 * bar on mobile (site owner rule, 2026-09-07: "شريط المنتج له الأولوية"). */
function isProductDetailPath(pathname: string) {
  return pathname.startsWith("/store/") && pathname.split("/").filter(Boolean).length === 3;
}

/**
 * Site-wide floating stack — back-to-top (white, appears past ~600px scroll),
 * call (black), WhatsApp (green), in that order top-to-bottom (v2 identity
 * brief, 2026-09-07). Fixed bottom-left on every public page, same anchor
 * point, only the WhatsApp button pulses. Deliberately not mirrored for RTL:
 * the brief pins this to literal bottom-left in both locales, matching the
 * approved mockup.
 *
 * Hidden on mobile specifically on product detail pages, which have their
 * own fixed WhatsApp/call bar at the bottom of the screen — two overlapping
 * fixed bars there would collide (site owner follow-up, 2026-09-07).
 */
export function FloatingActions({ locale }: { locale: "ar" | "en" }) {
  const c = content[locale];
  const t = useTranslations("nav");
  const pathname = usePathname();
  const onProductPage = isProductDetailPath(pathname);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > BACK_TO_TOP_THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <div
      className={cn(
        "fixed bottom-8 left-8 z-50 flex flex-col items-center gap-3.5",
        onProductPage && "hidden lg:flex"
      )}
    >
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t("backToTop")}
          className="flex size-13 items-center justify-center rounded-full bg-card text-foreground shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <ArrowUp className="size-5" strokeWidth={2.2} />
        </button>
      )}
      <a
        href={`tel:${BUSINESS.phoneE164}`}
        aria-label={c.call}
        className="flex size-14 items-center justify-center rounded-full bg-ink text-ink-foreground shadow-lg transition-transform hover:-translate-y-0.5"
      >
        <Phone className="size-6" strokeWidth={1.7} />
      </a>
      <a
        href={buildWhatsAppLink(c.message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={c.whatsapp}
        className="animate-whatsapp-pulse flex size-15 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle className="size-7" strokeWidth={1.7} />
      </a>
    </div>
  );
}
