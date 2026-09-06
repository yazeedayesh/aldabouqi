"use client";

import { MessageCircle, Phone } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

const content = {
  ar: { call: "اتصل بنا", whatsapp: "تواصل عبر واتساب", message: "مرحباً، أرغب بالاستفسار" },
  en: { call: "Call us", whatsapp: "Chat on WhatsApp", message: "Hi, I'd like to ask about your services" },
} as const;

/** /store/{category}/{slug} — the one page with its own fixed bottom action
 * bar on mobile (site owner rule, 2026-09-07: "شريط المنتج له الأولوية"). */
function isProductDetailPath(pathname: string) {
  return pathname.startsWith("/store/") && pathname.split("/").filter(Boolean).length === 3;
}

/**
 * Site-wide call + WhatsApp buttons (brief §5) — fixed bottom-left on every
 * public page, call above WhatsApp, same anchor point, only the WhatsApp
 * button pulses. Deliberately not mirrored for RTL: the brief pins this to
 * literal bottom-left in both locales, matching the approved mockup.
 *
 * Hidden on mobile specifically on product detail pages, which have their
 * own fixed WhatsApp/call bar at the bottom of the screen — two overlapping
 * fixed bars there would collide (site owner follow-up, 2026-09-07).
 */
export function FloatingActions({ locale }: { locale: "ar" | "en" }) {
  const c = content[locale];
  const pathname = usePathname();
  const onProductPage = isProductDetailPath(pathname);

  return (
    <div
      className={cn(
        "fixed bottom-8 left-8 z-50 flex flex-col items-center gap-3.5",
        onProductPage && "hidden lg:flex"
      )}
    >
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
        className="animate-whatsapp-pulse flex size-15 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle className="size-7" strokeWidth={1.7} />
      </a>
    </div>
  );
}
