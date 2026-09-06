"use client";

import { Heart } from "lucide-react";
import { useInterestList } from "@/hooks/use-interest-list";
import { cn } from "@/lib/utils";

const label = {
  ar: { add: "أضف لقائمة الاهتمام", remove: "إزالة من قائمة الاهتمام" },
  en: { add: "Add to interest list", remove: "Remove from interest list" },
} as const;

const buttonLabel = {
  ar: { add: "أضف للاهتمام", added: "أُضيف للاهتمام" },
  en: { add: "Add to interest", added: "Added to interest" },
} as const;

export function InterestToggleButton({
  slug,
  categorySlug,
  titleAr,
  titleEn,
  locale,
  className,
  variant = "icon",
}: {
  slug: string;
  categorySlug: string;
  titleAr: string;
  titleEn: string;
  locale: "ar" | "en";
  className?: string;
  /** "icon": small circular toggle for overlays (product cards). "button": full labeled button for the purchase-panel CTA row (site owner follow-up, 2026-09-07 — "أضف للاهتمام" is now its own button, not a small icon). */
  variant?: "icon" | "button";
}) {
  const { has, toggle, hydrated } = useInterestList();
  const active = hydrated && has(slug);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle({ slug, category: categorySlug, titleAr, titleEn });
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={handleClick}
        className={cn(
          "flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] text-[14.5px] font-semibold transition-colors",
          active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40",
          className
        )}
      >
        <Heart className="size-[18px]" strokeWidth={1.7} fill={active ? "currentColor" : "none"} />
        {active ? buttonLabel[locale].added : buttonLabel[locale].add}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? label[locale].remove : label[locale].add}
      onClick={handleClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary",
        active && "border-primary/40 bg-primary/10 text-primary",
        className
      )}
    >
      <Heart className="size-4" strokeWidth={1.7} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
