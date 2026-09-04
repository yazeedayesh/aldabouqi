import { setRequestLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { JsonLd, BreadcrumbJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL, buildWhatsAppLink } from "@/lib/constants";
import { areas } from "@/lib/areas";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "مناطق التغطية | شركة الدابوقي لشراء الأثاث المستعمل في عمان",
    metaDescription:
      "شركة الدابوقي تغطي كل مناطق عمان: خلدا، شفا بدران، تلاع العلي، الشميساني، عبدون، الجبيهة، صويلح، العبدلي وغيرها. اختر منطقتك وتواصل معنا مباشرة.",
    keywords:
      "مناطق شراء اثاث مستعمل عمان, شراء اثاث مستعمل خلدا, شراء اثاث مستعمل تلاع العلي, شراء اثاث مستعمل عبدون, الدابوقي",
    pageTitle: "مناطق التغطية",
    intro:
      "شركة الدابوقي تشتري الأثاث المستعمل في كل مناطق عمان تقريبًا. اختر منطقتك من تحت وشوف تفاصيل الخدمة وطريقة التواصل المباشرة، أو اتصل فينا مباشرة إذا منطقتك مش مذكورة وبنأكدلك التغطية.",
    linkLabel: "شراء اثاث مستعمل",
    notListed: "منطقتك مش موجودة بالقائمة؟",
    notListedCta: "تواصل معنا وبنأكدلك التغطية",
    howToTitle: "كيف تبيع أثاثك المستعمل؟",
    howTo: [
      { name: "اتصل بنا أو أرسل صور الأثاث", text: "اتصل على رقمنا +962796983994 أو أرسل لنا صوراً للأثاث عبر الواتساب" },
      { name: "معاينة مجانية في موقعك", text: "يزورك أحد خبرائنا في الموعد المحدد لمعاينة الأثاث بشكل شامل وتقديم تقييم دقيق" },
      { name: "عرض السعر والتفاوض", text: "نقدم لك السعر المناسب بناءً على حالة الأثاث وجودته مع إمكانية التفاوض" },
      { name: "الدفع الفوري ونقل الأثاث", text: "بعد الاتفاق نقوم بالدفع نقداً مباشرة ونتولى عملية النقل مجاناً" },
    ],
  },
  en: {
    metaTitle: "Coverage Areas | Aldabouqi - Buying Used Furniture in Amman",
    metaDescription:
      "Aldabouqi covers all Amman areas: Khalda, Shafa Badran, Tlaa Al Ali, Shmeisani, Abdoun, Jubaiha, Sweileh, Abdali and more. Pick your area and contact us directly.",
    keywords:
      "used furniture buyer Amman areas, sell furniture Khalda, sell furniture Tlaa Al Ali, sell furniture Abdoun, Aldabouqi",
    pageTitle: "Coverage Areas",
    intro:
      "Aldabouqi buys used furniture in nearly every area of Amman. Pick your area below to see service details and how to reach us directly, or contact us if your area isn't listed and we'll confirm coverage.",
    linkLabel: "Buy Used Furniture",
    notListed: "Don't see your area listed?",
    notListedCta: "Contact us and we'll confirm coverage",
    howToTitle: "How to sell your used furniture",
    howTo: [
      { name: "Call us or send photos", text: "Call us at +962796983994 or send us photos of the furniture on WhatsApp" },
      { name: "Free on-site inspection", text: "One of our experts visits at the agreed time for a thorough inspection and accurate valuation" },
      { name: "Price offer and negotiation", text: "We offer a fair price based on the furniture's condition and quality, with room to negotiate" },
      { name: "Instant payment and pickup", text: "Once agreed, we pay cash immediately and handle the furniture pickup for free" },
    ],
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/coverage-areas">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/coverage-areas",
    locale: locale as Locale,
  });
}

export default async function CoverageAreasPage({ params }: PageProps<"/[locale]/coverage-areas">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${c.pageTitle} - ${BUSINESS.nameAr}`,
          url: `${SITE_URL}${locale === "en" ? "/en" : ""}/coverage-areas`,
          hasPart: areas.map((area, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: locale === "en" ? area.nameEn : area.nameAr,
            item: `${SITE_URL}/buy-used-furniture-${area.slug}`,
          })),
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: locale === "en" ? "Services" : "خدماتنا", path: "/services" },
          { name: c.pageTitle, path: "/coverage-areas" },
        ]}
      />
      <HowToJsonLd
        name={c.howToTitle}
        description={c.howToTitle}
        steps={c.howTo.map((s) => ({ name: s.name, text: s.text }))}
      />

      <PageHero
        title={c.pageTitle}
        crumbs={[
          { href: "/services", label: locale === "en" ? "Services" : "خدماتنا" },
          { href: "/coverage-areas", label: c.pageTitle },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center leading-relaxed text-muted-foreground">
          {c.intro}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/buy-used-furniture-${area.slug}`}
              className="group flex items-center justify-between rounded-xl border border-border p-5 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <span className="flex items-center gap-3 font-heading font-semibold text-foreground">
                <MapPin className="size-4 text-primary" />
                {locale === "en" ? area.nameEn : area.nameAr}
              </span>
              <span className="text-sm text-muted-foreground group-hover:text-primary">
                {c.linkLabel}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-heading font-semibold text-foreground">{c.notListed}</p>
          <Button
            className="mt-4 bg-[#25D366] text-white hover:bg-[#1ebe57]"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppLink(c.notListedCta)}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            {c.notListedCta}
          </Button>
        </div>
      </section>
    </>
  );
}
