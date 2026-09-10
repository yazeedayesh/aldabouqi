"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ProductImagePlaceholder } from "@/components/store/product-image-placeholder";
import { useSwipeIndex } from "@/hooks/use-swipe-index";
import type { ProductImage } from "@/db/schema";
import { cn } from "@/lib/utils";

const THUMB_SLOTS = 5;

/**
 * Product image gallery (brief §6.3, redesigned 2026-09-07; real swipe
 * added 2026-09-10 per site owner request): a real touch-swipeable main
 * image (native CSS scroll-snap, works identically on mobile and desktop
 * trackpad/mouse-drag) with a 5-slot thumbnail row on desktop and dot
 * indicators everywhere. Tapping/clicking a slide opens the same full
 * lightbox with pinch/drag zoom and swipe between every photo.
 */
export function ProductGallery({
  images,
  title,
  conditionLabel,
  zoomHint,
  noPhotoLabel,
  categorySlug,
}: {
  images: ProductImage[];
  title: string;
  conditionLabel: string;
  zoomHint: string;
  noPhotoLabel: string;
  categorySlug?: string;
}) {
  const { containerRef, index, scrollToIndex } = useSwipeIndex(images.length);
  const [open, setOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-[22px] border border-border bg-secondary/40 lg:aspect-4/3">
        <ProductImagePlaceholder label={noPhotoLabel} categorySlug={categorySlug} />
      </div>
    );
  }

  const visibleThumbs = images.slice(0, THUMB_SLOTS - 1);
  const overflowCount = images.length - THUMB_SLOTS + 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square w-full overflow-hidden rounded-[22px] border border-border bg-secondary/40 lg:aspect-4/3">
        <div
          ref={containerRef}
          className="scrollbar-hide flex size-full snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => {
                scrollToIndex(i);
                setOpen(true);
              }}
              aria-label={title}
              className="relative h-full w-full shrink-0 snap-center"
            >
              <Image
                src={img.url}
                alt={img.alt || title}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <span className="pointer-events-none absolute top-3.5 start-3.5 flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[12.5px] font-bold lg:h-8 lg:px-3.5">
          <span className="size-[6px] rounded-full bg-primary lg:size-[7px]" />
          {conditionLabel}
        </span>
        <span className="pointer-events-none absolute bottom-3.5 start-3.5 hidden h-[34px] items-center gap-1.5 rounded-full bg-card/92 px-3.5 text-[12.5px] font-semibold text-muted-foreground lg:flex">
          <Search className="size-[15px]" strokeWidth={1.7} />
          {zoomHint}
        </span>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToIndex(index - 1)}
              disabled={index === 0}
              aria-label="Previous"
              className="absolute start-3 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-card/92 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0 lg:flex"
            >
              <ChevronRight className="size-4.5 rtl:rotate-0 ltr:rotate-180" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(index + 1)}
              disabled={index === images.length - 1}
              aria-label="Next"
              className="absolute end-3 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-card/92 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0 lg:flex"
            >
              <ChevronLeft className="size-4.5 rtl:rotate-0 ltr:rotate-180" strokeWidth={2.2} />
            </button>

            <span className="pointer-events-none absolute inset-x-0 bottom-3.5 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-primary" : "w-1.5 bg-card")}
                />
              ))}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="hidden grid-cols-5 gap-3 lg:grid">
          {visibleThumbs.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-[13px] bg-secondary/40",
                i === index ? "border-2 border-primary" : "border border-border"
              )}
            >
              <Image src={img.url} alt={img.alt || title} fill className="object-cover" sizes="120px" />
            </button>
          ))}
          {overflowCount > 0 && (
            <button
              type="button"
              onClick={() => {
                scrollToIndex(THUMB_SLOTS - 1);
                setOpen(true);
              }}
              className="relative flex aspect-square items-center justify-center rounded-[13px] bg-ink text-[14px] font-bold text-ink-foreground"
            >
              +{overflowCount}
            </button>
          )}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        on={{ view: ({ index: i }) => scrollToIndex(i) }}
        slides={images.map((img) => ({ src: img.url, alt: img.alt || title }))}
        plugins={[Zoom]}
      />
    </div>
  );
}
