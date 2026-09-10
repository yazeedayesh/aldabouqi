"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useSwipeIndex } from "@/hooks/use-swipe-index";
import { ProductImagePlaceholder } from "@/components/store/product-image-placeholder";
import type { ProductImage } from "@/db/schema";
import { cn } from "@/lib/utils";

/**
 * Real touch-swipeable image area for a product card in a listing grid
 * (site owner request, 2026-09-10: "flip through images from the listing
 * too, not just the detail page"). Native CSS scroll-snap, no library.
 * Self-contained (the decorative Link + the images + the dot indicators)
 * so the surrounding card can stay a Server Component — only this piece
 * ships client JS, for the dots' current-index state. The Link mirrors
 * the previous single-image version: aria-hidden + tabIndex=-1, since the
 * real accessible link to the product is the card's text area below.
 */
export function ProductCardImageCarousel({
  href,
  images,
  title,
  noPhotoLabel,
  categorySlug,
}: {
  href: `/${string}`;
  images: ProductImage[];
  title: string;
  noPhotoLabel: string;
  categorySlug: string;
}) {
  const { containerRef, index, scrollToIndex } = useSwipeIndex(images.length);

  if (images.length === 0) {
    return (
      <Link href={href} aria-hidden tabIndex={-1} className="absolute inset-0 z-0">
        <ProductImagePlaceholder label={noPhotoLabel} categorySlug={categorySlug} />
      </Link>
    );
  }

  return (
    <>
      <Link href={href} aria-hidden tabIndex={-1} className="absolute inset-0 z-0">
        <div ref={containerRef} className="scrollbar-hide flex size-full snap-x snap-mandatory overflow-x-auto">
          {images.map((img) => (
            <div key={img.url} className="relative h-full w-full shrink-0 snap-center">
              <Image
                src={img.url}
                alt={img.alt || title}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 lg:group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
            </div>
          ))}
        </div>
      </Link>

      {images.length > 1 && (
        <span className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1 transition-opacity lg:group-hover:opacity-0">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`${i + 1}/${images.length}`}
              className={cn(
                "pointer-events-auto h-1.5 rounded-full transition-all",
                i === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
              )}
            />
          ))}
        </span>
      )}
    </>
  );
}
