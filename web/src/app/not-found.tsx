import type { Metadata } from "next";
import { bodyFont, headingFont } from "@/lib/fonts";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";
import "./globals.css";

// Fallback for the rare request that never resolves to a `[locale]`
// segment (the real site 404 UI lives at `src/app/[locale]/not-found.tsx`
// and covers everything the next-intl middleware normally handles). This
// file has no parent layout, so it must define its own <html>/<body> —
// same pattern as `src/app/admin/layout.tsx`.
export const metadata: Metadata = {
  title: "الصفحة غير موجودة | شركة الدابوقي",
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl" className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}>
      <body className="flex min-h-full items-center justify-center bg-background px-4 py-20 text-center">
        <div className="mx-auto max-w-md">
          <h1 className="font-heading text-[88px] leading-none font-extrabold text-primary">404</h1>
          <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">هاي الصفحة مش موجودة</h2>
          <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted-foreground">
            يمكن الرابط قديم أو مكتوب غلط — بس الموقع شغال تمام.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/"
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-primary-foreground"
            >
              الصفحة الرئيسية
            </a>
            <a
              href={buildWhatsAppLink("وصلتني صفحة غير موجودة بالموقع")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-lg border-[1.5px] border-ink px-4 text-sm font-medium"
            >
              تواصل معنا
            </a>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">{BUSINESS.nameAr}</p>
        </div>
      </body>
    </html>
  );
}
