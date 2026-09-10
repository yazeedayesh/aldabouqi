import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { BUSINESS, SITE_URL } from "@/lib/constants";

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path without locale prefix, e.g. "/" or "/about" or "/buy-used-furniture-abdali". */
  path: string;
  locale: Locale;
  /** Set false for ar-only pages (e.g. neighborhood pages) that have no /en counterpart. */
  hasEnglishVariant?: boolean;
  ogImage?: string;
  /** Comma-separated, sourced verbatim from the current page's <meta name="keywords">. */
  keywords?: string;
};

function localizedUrl(path: string, locale: Locale) {
  const normalizedPath = path === "/" ? "" : path;
  const prefix = locale === "en" ? "/en" : "";
  return `${SITE_URL}${prefix}${normalizedPath}` || SITE_URL;
}

/**
 * Shared generateMetadata() helper. Title/description content should be
 * sourced verbatim from the current site's <head> tags per page — this
 * function only standardizes canonical/hreflang/OG wiring, not content.
 */
export function buildMetadata({
  title,
  description,
  path,
  locale,
  hasEnglishVariant = true,
  ogImage,
  keywords,
}: BuildMetadataInput): Metadata {
  const canonical = localizedUrl(path, locale);
  // Falls back to the exact source photo the favicon is generated from
  // (src/app/icon.png etc.) so a shared link's preview image matches the
  // browser-tab icon (site owner request, 2026-09-10) — pages with a more
  // relevant photo (a product, a specific service) still pass their own.
  const resolvedOgImage = ogImage ?? `${SITE_URL}/img/logo/aldabouqi-logo.webp`;

  const languages: Record<string, string> = hasEnglishVariant
    ? {
        ar: localizedUrl(path, "ar"),
        en: localizedUrl(path, "en"),
        "x-default": localizedUrl(path, "ar"),
      }
    : {};

  return {
    // { absolute } bypasses the root [locale] layout's title.template
    // ("%s | <business name>") — every page's title here already has its
    // own " | ..." suffix sourced verbatim from the old site, so the
    // template would otherwise double it up.
    title: { absolute: title },
    description,
    // Passed as the raw string, not split into an array: Next.js joins a
    // keywords array with "," (no space) when serializing the meta tag,
    // which doesn't match the old site's ", "-separated content verbatim.
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
      ...(hasEnglishVariant ? { languages } : {}),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BUSINESS.nameAr,
      locale: locale === "ar" ? "ar_JO" : "en_US",
      type: "website",
      images: [{ url: resolvedOgImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage],
    },
  };
}
