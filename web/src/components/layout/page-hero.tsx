import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Crumb = { href: string; label: string };

/**
 * Optional hero photo (brief follow-up, 2026-09-05): a fixed-height wrapper
 * with `fill` + explicit `sizes` keeps this CLS-safe regardless of image
 * load timing — the space is reserved by the wrapper, not the image.
 * `priority` is intentional: this is the page's above-the-fold LCP element
 * whenever it's used.
 */
export function PageHero({
  title,
  crumbs,
  image,
}: {
  title: string;
  crumbs: Crumb[];
  image?: { src: string; alt: string };
}) {
  const t = useTranslations("nav");

  const content = (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1
        className={
          "font-heading text-3xl font-bold tracking-tight sm:text-4xl " +
          (image ? "text-white" : "text-foreground")
        }
      >
        {title}
      </h1>
      <nav aria-label="breadcrumb" className="mt-3">
        <ol
          className={
            "flex flex-wrap items-center gap-1.5 text-sm " +
            (image ? "text-white/80" : "text-muted-foreground")
          }
        >
          <li>
            <Link href="/" className={image ? "hover:text-white" : "hover:text-primary"}>
              {t("home")}
            </Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <ChevronLeft className="size-3.5 rtl:rotate-0 ltr:rotate-180" />
              <Link href={crumb.href} className={image ? "hover:text-white" : "hover:text-primary"}>
                {crumb.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );

  if (image) {
    return (
      <div className="relative flex min-h-[280px] items-end overflow-hidden sm:min-h-[340px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/50 to-ink/20" />
        <div className="relative w-full">{content}</div>
      </div>
    );
  }

  return <div className="border-b border-border bg-secondary/30">{content}</div>;
}
