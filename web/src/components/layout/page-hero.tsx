import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Crumb = { href: string; label: string };

export function PageHero({ title, crumbs }: { title: string; crumbs: Crumb[] }) {
  const t = useTranslations("nav");

  return (
    <div className="border-b border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <nav aria-label="breadcrumb" className="mt-3">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                {t("home")}
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <ChevronLeft className="size-3.5 rtl:rotate-0 ltr:rotate-180" />
                <Link href={crumb.href} className="hover:text-primary">
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
