import { ImageOff } from "lucide-react";

/**
 * Shown whenever a product has no real photo yet, instead of a broken
 * <img> or (worse) a stock photo that doesn't match the listing — e.g. the
 * seed data originally shipped with a wall-mounted-AC stock photo on both
 * furniture listings. Deliberately not a fake furniture render: honest
 * "no photo yet" beats a photo that's actively wrong.
 */
export function ProductImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-accent text-muted-foreground">
      <ImageOff className="size-8 opacity-50" />
      <span className="px-4 text-center text-xs font-medium opacity-70">{label}</span>
    </div>
  );
}
