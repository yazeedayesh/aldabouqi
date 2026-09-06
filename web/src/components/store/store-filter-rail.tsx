"use client";

import { Check, MessageCircle } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { PriceRangeSlider } from "@/components/store/price-range-slider";
import { buildStoreQuery, type StoreFilters } from "@/lib/store-query";
import { buildStoreWhatsAppLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CategoryCount = { slug: string; name: string; count: number };
type ConditionCount = { value: "excellent" | "good" | "fair"; label: string; count: number };

export function StoreFilterRail({
  locale,
  activeCategorySlug,
  categories,
  allCategoriesCount,
  conditions,
  filters,
  priceBounds,
  content,
  onNavigate,
}: {
  locale: "ar" | "en";
  activeCategorySlug?: string;
  categories: CategoryCount[];
  allCategoriesCount: number;
  conditions: ConditionCount[];
  filters: StoreFilters;
  priceBounds: { min: number; max: number };
  content: {
    categoriesTitle: string;
    allCategories: string;
    conditionTitle: string;
    priceTitle: string;
    from: string;
    to: string;
    availabilityTitle: string;
    availableOnly: string;
    includeSold: string;
    sellTitle: string;
    sellBody: string;
    sellCta: string;
  };
  /** Called after a filter link/checkbox is applied — used to close the mobile filter sheet. */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function apply(overrides: Partial<StoreFilters>) {
    router.push(pathname + buildStoreQuery(filters, overrides));
    onNavigate?.();
  }

  function toggleCondition(value: "excellent" | "good" | "fair") {
    const next = filters.conditions.includes(value)
      ? filters.conditions.filter((c) => c !== value)
      : [...filters.conditions, value];
    apply({ conditions: next });
  }

  return (
    <div className="flex flex-col gap-3.5">
      <FilterCard title={content.categoriesTitle}>
        <div className="flex flex-col gap-0.5">
          <Link
            href="/store"
            onClick={() => onNavigate?.()}
            className={cn(
              "flex h-[38px] items-center justify-between rounded-[10px] px-3 text-sm",
              !activeCategorySlug ? "bg-accent font-bold text-gold-dark" : "text-muted-foreground"
            )}
          >
            <span>{content.allCategories}</span>
            <span className="text-[12.5px] opacity-80">{allCategoriesCount}</span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/store/${cat.slug}`}
              onClick={() => onNavigate?.()}
              className={cn(
                "flex h-[38px] items-center justify-between rounded-[10px] px-3 text-sm",
                activeCategorySlug === cat.slug ? "bg-accent font-bold text-gold-dark" : "text-muted-foreground"
              )}
            >
              <span>{cat.name}</span>
              <span className="text-[12.5px]">{cat.count}</span>
            </Link>
          ))}
        </div>
      </FilterCard>

      <FilterCard title={content.conditionTitle}>
        <div className="flex flex-col gap-2.5">
          {conditions.map((c) => (
            <Checkbox
              key={c.value}
              checked={filters.conditions.includes(c.value)}
              onChange={() => toggleCondition(c.value)}
              label={c.label}
              count={c.count}
            />
          ))}
        </div>
      </FilterCard>

      <FilterCard title={content.priceTitle}>
        <PriceRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          valueMin={filters.minPrice}
          valueMax={filters.maxPrice}
          onCommit={(minPrice, maxPrice) => apply({ minPrice, maxPrice })}
          fromLabel={content.from}
          toLabel={content.to}
        />
      </FilterCard>

      <FilterCard title={content.availabilityTitle}>
        <div className="flex flex-col gap-2.5">
          <Checkbox checked={!filters.includeSold} onChange={() => apply({ includeSold: false })} label={content.availableOnly} />
          <Checkbox checked={filters.includeSold} onChange={() => apply({ includeSold: true })} label={content.includeSold} />
        </div>
      </FilterCard>

      <div className="rounded-2xl bg-ink p-[22px] text-ink-foreground">
        <p className="font-heading mb-2 text-base font-extrabold">{content.sellTitle}</p>
        <p className="mb-4 text-[13.5px] leading-relaxed opacity-78">{content.sellBody}</p>
        <a
          href={buildStoreWhatsAppLink(
            locale === "en" ? "Hi, I'd like to sell my used furniture" : "مرحباً، بدي أبيع أثاثي المستعمل"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[42px] items-center justify-center gap-2 rounded-full bg-whatsapp text-sm font-bold text-white"
        >
          <MessageCircle className="size-4" strokeWidth={1.9} />
          {content.sellCta}
        </a>
      </div>
    </div>
  );
}

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-heading mb-3.5 text-[15px] font-extrabold">{title}</p>
      {children}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={cn(
          "flex size-[19px] shrink-0 items-center justify-center rounded-[6px] border",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border"
        )}
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      <span className={checked ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      {count !== undefined && <span className="ms-auto text-[12.5px] text-muted-foreground">{count}</span>}
    </label>
  );
}
