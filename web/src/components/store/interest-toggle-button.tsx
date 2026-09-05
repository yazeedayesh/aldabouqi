"use client";

import { Heart } from "lucide-react";
import { useInterestList } from "@/hooks/use-interest-list";
import { cn } from "@/lib/utils";

const label = {
  ar: { add: "أضف لقائمة الاهتمام", remove: "إزالة من قائمة الاهتمام" },
  en: { add: "Add to interest list", remove: "Remove from interest list" },
} as const;

export function InterestToggleButton({
  slug,
  categorySlug,
  titleAr,
  titleEn,
  locale,
  className,
}: {
  slug: string;
  categorySlug: string;
  titleAr: string;
  titleEn: string;
  locale: "ar" | "en";
  className?: string;
}) {
  const { has, toggle, hydrated } = useInterestList();
  const active = hydrated && has(slug);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? label[locale].remove : label[locale].add}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ slug, category: categorySlug, titleAr, titleEn });
      }}
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
