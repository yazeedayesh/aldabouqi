"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useInterestList } from "@/hooks/use-interest-list";
import { usePathname } from "@/i18n/navigation";
import { buildStoreWhatsAppLink, SITE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** /store/{category}/{slug} — the one page with its own fixed bottom action
 * bar on mobile (site owner rule, 2026-09-07: "شريط المنتج له الأولوية"). */
function isProductDetailPath(pathname: string) {
  return pathname.startsWith("/store/") && pathname.split("/").filter(Boolean).length === 3;
}

const content = {
  ar: {
    cta: "تواصل بخصوص القطع المختارة",
    empty: "قائمة الاهتمام فارغة",
    title: "قائمة الاهتمام",
    intro: "مرحباً، أنا مهتم بالقطع التالية:",
  },
  en: {
    cta: "Ask about selected items",
    empty: "Your interest list is empty",
    title: "Interest list",
    intro: "Hi, I'm interested in the following items:",
  },
} as const;

/** Floating counterpart to FloatingActions (§5), on the opposite corner so the two never overlap. */
export function InterestBar({ locale }: { locale: "ar" | "en" }) {
  const { items, remove, hydrated } = useInterestList();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const c = content[locale];

  if (!hydrated || items.length === 0) return null;
  const onProductPage = isProductDetailPath(pathname);

  const message = [
    c.intro,
    ...items.map(
      (item) =>
        `- ${locale === "en" ? item.titleEn : item.titleAr} — ${SITE_URL}/${locale === "en" ? "en/" : ""}store/${item.category}/${item.slug}`
    ),
  ].join("\n");

  return (
    <div className={cn("fixed bottom-8 right-8 z-50", onProductPage && "hidden lg:block")}>
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-border bg-card p-4 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-foreground">{c.title}</h3>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <ul className="max-h-48 space-y-2 overflow-y-auto">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-foreground">{locale === "en" ? item.titleEn : item.titleAr}</span>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <Button
            className="mt-3 w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-dark"
            nativeButton={false}
            render={<a href={buildStoreWhatsAppLink(message)} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            {c.cta}
          </Button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-12 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-ink-foreground shadow-lg transition-transform hover:-translate-y-0.5"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {items.length}
        </span>
        {c.title}
      </button>
    </div>
  );
}
