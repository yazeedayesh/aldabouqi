"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export function ProductLightbox({
  open,
  close,
  index,
  onView,
  slides,
}: {
  open: boolean;
  close: () => void;
  index: number;
  onView: (index: number) => void;
  slides: { src: string; alt: string }[];
}) {
  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      on={{ view: ({ index: i }) => onView(i) }}
      slides={slides}
      plugins={[Zoom]}
    />
  );
}
