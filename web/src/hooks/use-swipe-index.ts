"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks which slide is centered in a native horizontal scroll-snap
 * container (real touch swipe, no carousel library) and exposes a way to
 * jump to a slide programmatically — shared by the product card's mini
 * gallery and the product detail page's main gallery (site owner request,
 * 2026-09-10: real swipeable images, not just static dots).
 *
 * Reads slides straight off `containerRef.current.children` rather than
 * collecting them via per-slide ref callbacks — one less layer of
 * indirection, and the container's direct children are always exactly the
 * slides in both call sites.
 *
 * Deliberately IntersectionObserver-based rather than scrollLeft math:
 * this site is RTL-first, and `scrollLeft`'s sign/range for an RTL
 * container is inconsistent across Chrome/Firefox/Safari (verified: the
 * initial index read back as the LAST slide instead of the first).
 * IntersectionObserver and scrollIntoView both work identically regardless
 * of direction, so this sidesteps the inconsistency entirely.
 */
export function useSwipeIndex(count: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || count === 0) return;
    const slides = Array.from(root.children);

    // RTL overflow containers in Chrome/Firefox/Safari don't agree on
    // which end "unscrolled" starts at — several default to showing the
    // LAST child instead of the first. Force the real first slide into
    // view on mount so the gallery always opens on slide 0, regardless of
    // the browser's native RTL scroll-origin convention.
    slides[0]?.scrollIntoView({ behavior: "instant" as ScrollBehavior, inline: "center", block: "nearest" });

    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
        let bestEl: Element | null = null;
        let bestRatio = 0;
        for (const [el, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestEl = el;
          }
        }
        if (bestEl) {
          const i = slides.indexOf(bestEl);
          if (i !== -1) setIndex(i);
        }
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const el of slides) observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  const scrollToIndex = useCallback((i: number) => {
    const root = containerRef.current;
    if (!root) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    root.children[clamped]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [count]);

  return { containerRef, index, scrollToIndex };
}
