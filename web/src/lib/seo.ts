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

  const languages: Record<string, string> = hasEnglishVariant
    ? {
        ar: localizedUrl(path, "ar"),
        en: localizedUrl(path, "en"),
        "x-default": localizedUrl(path, "ar"),
      }
    : {};

  return {
    title,
    description,
    ...(keywords ? { keywords: keywords.split(",").map((k) => k.trim()) } : {}),
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
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
