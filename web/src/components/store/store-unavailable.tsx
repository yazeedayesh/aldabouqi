import { MessageCircle, Phone } from "lucide-react";
import { buildStoreWhatsAppLink, STORE_PHONE_DISPLAY, STORE_PHONE_E164 } from "@/lib/constants";

const content = {
  ar: {
    title: "المتجر غير متوفر مؤقتاً",
    body: "في عطل تقني مؤقت عنا وعم نعمل على حله. بإمكانك تتواصل معنا مباشرة على واتساب أو بالاتصال وبنساعدك فوراً.",
    whatsapp: "تواصل على واتساب",
    call: "اتصل الآن",
    whatsappMessage: "مرحباً، حاولت أفتح صفحة المتجر وما فتحت — ممكن تساعدوني؟",
  },
  en: {
    title: "The store is temporarily unavailable",
    body: "We're experiencing a temporary technical issue and are already working on it. Message us on WhatsApp or give us a call and we'll help right away.",
    whatsapp: "Message on WhatsApp",
    call: "Call now",
    whatsappMessage: "Hi, I tried to open the store page and it didn't load — can you help?",
  },
} as const;

/**
 * Rendered by /store and /store/[category] when the product-catalog cache
 * is cold and the database is unreachable (see lib/store-data.ts) — the
 * one case the stale-while-revalidate behavior of unstable_cache can't
 * paper over, because there's no previously-cached value to fall back to.
 * Kept deliberately simple (no data dependency at all) so it can never
 * itself fail to render. The matching plain-HTML version served straight
 * from middleware (lib/store-unavailable-html.ts) carries the same copy.
 */
export function StoreUnavailable({ locale }: { locale: "ar" | "en" }) {
  const c = content[locale];
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <h1 className="font-heading text-2xl font-black">{c.title}</h1>
      <p className="leading-relaxed text-muted-foreground">{c.body}</p>
      <div className="mt-2 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
        <a
          href={buildStoreWhatsAppLink(c.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[50px] items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-sm font-bold text-whatsapp-foreground"
        >
          <MessageCircle className="size-4" strokeWidth={1.9} />
          {c.whatsapp}
        </a>
        <a
          href={`tel:${STORE_PHONE_E164}`}
          dir="ltr"
          className="flex h-[50px] items-center justify-center gap-2 rounded-full border-[1.5px] border-ink px-6 text-sm font-bold"
        >
          <Phone className="size-4" strokeWidth={1.7} />
          {STORE_PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}
