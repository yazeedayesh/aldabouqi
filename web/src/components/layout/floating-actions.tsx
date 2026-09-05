import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";

const content = {
  ar: { call: "اتصل بنا", whatsapp: "تواصل عبر واتساب", message: "مرحباً، أرغب بالاستفسار" },
  en: { call: "Call us", whatsapp: "Chat on WhatsApp", message: "Hi, I'd like to ask about your services" },
} as const;

/**
 * Site-wide call + WhatsApp buttons (brief §5) — fixed bottom-left on every
 * public page, call above WhatsApp, same anchor point, only the WhatsApp
 * button pulses. Deliberately not mirrored for RTL: the brief pins this to
 * literal bottom-left in both locales, matching the approved mockup.
 */
export function FloatingActions({ locale }: { locale: "ar" | "en" }) {
  const c = content[locale];

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-center gap-3.5">
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
