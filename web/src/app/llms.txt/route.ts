import { BUSINESS, SITE_URL } from "@/lib/constants";

// llms.txt (llmstxt.org convention) — a Markdown summary for AI
// agents/LLMs, separate from robots.txt. There was no file at this exact
// reserved-looking path, which — like the earlier /favicon.ico case —
// falls through to [locale]/page.tsx with params.locale="llms.txt"
// instead of a clean 404, so this closes that gap with real content
// rather than just suppressing the error.
export function GET() {
  const body = `# ${BUSINESS.nameAr} (${BUSINESS.nameEn})

> شركة أردنية متخصصة في شراء وبيع الأثاث المستعمل في عمّان، بخبرة تمتد لأكثر من ٦٠ عامًا. نشتري الأثاث المنزلي والمكتبي والأجهزة الكهربائية بمعاينة مجانية ودفع نقدي فوري، وننشر قطعًا مفحوصة للبيع في متجرنا الإلكتروني.

## About

- Buys and sells used furniture (bedrooms, living rooms, office furniture, appliances, antiques) across every area of Amman, Jordan.
- Free on-site inspection, instant cash payment, and free moving.
- Website: ${SITE_URL} (Arabic default, English at /en)
- Phone / WhatsApp: ${BUSINESS.phoneDisplay}
- Email: ${BUSINESS.email}

## Key pages

- [Home](${SITE_URL}/): company overview, categories, coverage areas
- [Store](${SITE_URL}/store): live catalog of used furniture for sale
- [Services](${SITE_URL}/services): full list of buying/selling services
- [About](${SITE_URL}/about): company history and background
- [Coverage areas](${SITE_URL}/coverage-areas): the 36 Amman neighborhoods served
- [Contact](${SITE_URL}/contact): contact form and details
- [Sitemap](${SITE_URL}/sitemap.xml): full list of indexed URLs

## Notes for crawlers

- /admin and /api are private and disallowed — see /robots.txt.
- Content is bilingual: Arabic at the unprefixed path, English under /en.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
