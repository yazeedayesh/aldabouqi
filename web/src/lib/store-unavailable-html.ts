import { buildStoreWhatsAppLink, STORE_PHONE_DISPLAY, STORE_PHONE_E164 } from "@/lib/constants";

/**
 * Standalone HTML (no Next.js rendering pipeline, no DB read) returned
 * directly by proxy.ts's store-health gate with a real 503 status — a
 * Server Component page can't set a custom status code (Next.js only
 * exposes notFound/forbidden/unauthorized/redirect, all fixed codes), so
 * this is what actually lets Google see "temporarily down, retry later"
 * instead of indexing an empty 200. Copy is kept in sync by hand with
 * components/store/store-unavailable.tsx, the React version the page
 * itself renders (status 200) for the rare case where this gate's own
 * health probe passed but the page's own fetch still failed moments later.
 */
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

export function renderStoreUnavailableHtml(locale: "ar" | "en"): string {
  const c = content[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";
  const whatsappHref = buildStoreWhatsAppLink(c.whatsappMessage);

  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${c.title}</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #faf8f5; color: #1a1a1a; font-family: system-ui, -apple-system, "Segoe UI", Tahoma, Arial, sans-serif; }
  main { max-width: 440px; margin: 0 auto; padding: 48px 24px; text-align: center; }
  h1 { font-size: 24px; font-weight: 800; margin: 0 0 16px; }
  p { line-height: 1.7; color: #5a5a5a; margin: 0 0 28px; }
  .actions { display: flex; flex-direction: column; gap: 10px; }
  a.btn { display: flex; align-items: center; justify-content: center; gap: 8px; height: 50px; border-radius: 999px; font-size: 14px; font-weight: 700; text-decoration: none; }
  a.whatsapp { background: #25d366; color: #fff; }
  a.call { border: 1.5px solid #1a1a1a; color: #1a1a1a; }
</style>
</head>
<body>
<main>
  <h1>${c.title}</h1>
  <p>${c.body}</p>
  <div class="actions">
    <a class="btn whatsapp" href="${whatsappHref}" target="_blank" rel="noopener noreferrer">${c.whatsapp}</a>
    <a class="btn call" href="tel:${STORE_PHONE_E164}" dir="ltr">${STORE_PHONE_DISPLAY}</a>
  </div>
</main>
</body>
</html>`;
}
