"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ProductImagePlaceholder } from "@/components/store/product-image-placeholder";

/**
 * Product image gallery (brief §6.3): main image + clickable thumbnails,
 * full lightbox with pinch/drag zoom and swipe on mobile.
 */
export function ProductGallery({
  images,
  title,
  noPhotoLabel,
  categorySlug,
}: {
  images: string[];
  title: string;
  noPhotoLabel: string;
  categorySlug?: string;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary/40">
        <ProductImagePlaceholder label={noPhotoLabel} categorySlug={categorySlug} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-4/3 w-full overflow-hidden rounded-2xl bg-secondary/40"
        aria-label={title}
      >
        <Image src={images[index]} alt={title} fill priority className="object-cover" />
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-secondary/40 ring-2 transition-colors ${
                i === index ? "ring-primary" : "ring-transparent"
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        on={{ view: ({ index: i }) => setIndex(i) }}
        slides={images.map((src) => ({ src }))}
        plugins={[Zoom]}
      />
    </div>
  );
}
