"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ProductImagePlaceholder } from "@/components/store/product-image-placeholder";
import type { ProductImage } from "@/db/schema";
import { cn } from "@/lib/utils";

const THUMB_SLOTS = 5;

/**
 * Product image gallery (brief §6.3, redesigned 2026-09-07): main image +
 * 5-slot thumbnail row on desktop (4 real thumbnails + a "+N" overflow tile
 * when there are more than 4), a simpler single image + dot indicators on
 * mobile. Both open the same full lightbox with pinch/drag zoom and swipe.
 *
 * Mobile note: the dots are a static count indicator, not a live swipe
 * preview — building a real pre-lightbox swipe carousel would need a
 * carousel dependency wired up just for this one view; tapping the image
 * opens the already-working lightbox, which does support swiping between
 * every photo. Flagged as a simplification, not silently downgraded.
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
  const [index, setIndex] = useState(0);
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-square w-full overflow-hidden rounded-[22px] border border-border bg-secondary/40 lg:aspect-4/3"
        aria-label={title}
      >
        <Image
          src={images[index].url}
          alt={images[index].alt || title}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
        <span className="absolute top-3.5 start-3.5 flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[12.5px] font-bold lg:h-8 lg:px-3.5">
          <span className="size-[6px] rounded-full bg-primary lg:size-[7px]" />
          {conditionLabel}
        </span>
        <span className="absolute bottom-3.5 start-3.5 hidden h-[34px] items-center gap-1.5 rounded-full bg-card/92 px-3.5 text-[12.5px] font-semibold text-muted-foreground lg:flex">
          <Search className="size-[15px]" strokeWidth={1.7} />
          {zoomHint}
        </span>

        {images.length > 1 && (
          <span className="absolute inset-x-0 bottom-3.5 flex justify-center gap-1.5 lg:hidden">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full",
                  i === 0 ? "w-5 bg-primary" : "w-1.5 bg-card"
                )}
              />
            ))}
          </span>
        )}
      </button>

      {images.length > 1 && (
        <div className="hidden grid-cols-5 gap-3 lg:grid">
          {visibleThumbs.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setIndex(i)}
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
                setIndex(THUMB_SLOTS - 1);
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
        on={{ view: ({ index: i }) => setIndex(i) }}
        slides={images.map((img) => ({ src: img.url, alt: img.alt || title }))}
        plugins={[Zoom]}
      />
    </div>
  );
}
