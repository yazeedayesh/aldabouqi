import { getCategoryIcon } from "@/lib/category-icons";

/**
 * Shown whenever a product has no real photo yet, instead of a broken
 * <img> or (worse) a stock photo that doesn't match the listing — e.g. the
 * seed data originally shipped with a wall-mounted-AC stock photo on both
 * furniture listings. Deliberately not a fake furniture render: honest
 * "no photo yet" beats a photo that's actively wrong.
 *
 * It used to render lucide's `ImageOff` — a broken-image glyph, which reads
 * as "this page is broken" rather than "photo coming". Brief §2.5 calls for
 * an elegant line illustration on a warm gradient instead, so we now draw the
 * product's own CATEGORY icon (bed, armchair, briefcase…) at display size in
 * the brand gold, over the cream/gold gradient. Pass `categorySlug` where the
 * category is known; without it the neutral package icon is used.
 */
export function ProductImagePlaceholder({
  label,
  categorySlug,
}: {
  label: string;
  categorySlug?: string;
}) {
  const Icon = getCategoryIcon(categorySlug ?? "");

  return (
    <div className="relative flex size-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-secondary via-background to-accent">
      {/* Soft gold halo behind the mark, so the tile has depth instead of
          reading as an empty box. */}
      <div
        aria-hidden
        className="pointer-events-none absolute size-40 rounded-full bg-primary/10 blur-2xl"
      />
      <Icon
        aria-hidden
        strokeWidth={1.2}
        className="relative size-14 text-primary/55"
      />
      <span className="relative px-4 text-center text-xs font-medium tracking-wide text-foreground/45">
        {label}
      </span>
    </div>
  );
}
