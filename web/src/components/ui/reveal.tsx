"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-triggered fade + translateY reveal (brief §9.1). Observes once and
 * unobserves after the element becomes visible — it never re-hides on
 * scroll-away, and honors prefers-reduced-motion via the CSS on [data-reveal].
 * `as` lets it render as `li` (etc.) when the parent requires a specific
 * child tag (e.g. an <ol> of steps) instead of always wrapping in a <div>.
 *
 * Trigger tuning: a bare `threshold: 0.15` with no rootMargin meant a tall
 * section had to be substantially on-screen before it even STARTED fading in,
 * so normal-speed scrolling showed large near-invisible blocks for a beat and
 * the page read as empty/broken. We now pre-trigger 240px BEFORE the element
 * enters the viewport (bottom rootMargin) at a hair-line threshold, so the
 * transition is already finishing by the time the reader reaches it.
 *
 * Safety net: if the observer never fires (hydration hiccup, an element that
 * starts fully in view, a browser that mis-reports intersection), a timer
 * reveals the content anyway. Content must never be permanently invisible
 * because an animation didn't run.
 */
export function Reveal({
  children,
  delayMs = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.style.transitionDelay = `${delayMs}ms`;
      el.classList.add("is-visible");
    };

    // Fallback: never leave content hidden if the observer doesn't fire.
    const failsafe = window.setTimeout(show, 1200);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.unobserve(el);
          window.clearTimeout(failsafe);
        }
      },
      // Start the reveal while the element is still below the fold.
      { threshold: 0.01, rootMargin: "0px 0px 240px 0px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [delayMs]);

  return (
    <Tag ref={ref as React.RefObject<never>} data-reveal className={className}>
      {children}
    </Tag>
  );
}
