"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * v2 identity brief (2026-09-07): logo click scrolls smoothly to top on the
 * homepage, navigates home from anywhere else, and respects
 * prefers-reduced-motion. Reused in the header, the full-screen mobile menu,
 * and the footer — "white" just inverts the one real logo file (pure
 * black-line-art on transparent, so brightness-0 invert is lossless) rather
 * than needing a second exported asset.
 */
export function SiteLogo({
  variant = "black",
  className,
  imgClassName,
  priority = false,
}: {
  variant?: "black" | "white";
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    e.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <Link href="/" onClick={handleClick} aria-label={t("logoAlt")} className={className}>
      <Image
        src="/img/logo/aldabouqi-black.webp"
        alt={t("logoAlt")}
        width={200}
        height={98}
        priority={priority}
        className={cn(imgClassName, variant === "white" && "brightness-0 invert")}
      />
    </Link>
  );
}
