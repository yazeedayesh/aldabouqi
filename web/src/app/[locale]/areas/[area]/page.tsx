import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { areas, getAreaBySlug } from "@/lib/areas";
import type { Locale } from "@/i18n/routing";

// Lives at the internal path /areas/[area]; proxy.ts rewrites the public
// URL /buy-used-furniture-[area] (and its /en/ variant) to this route,
// since Next.js dynamic segments can't mix a literal prefix with a
// bracket inside one folder name (confirmed empirically — see proxy.ts
// comment for details).
export function generateStaticParams() {
  return areas.map((a) => ({ area: a.slug }));
}

const content = {
  ar: {
    breadcrumbServices: "خدماتنا",
    howToSteps: [
      { title: "اتصل بنا أو", subtitle: "أرسل صور الأثاث", body: "اتصل على رقمنا 0796983994 أو أرسل لنا صوراً للأثاث عبر الواتساب. سنقوم بالرد عليك فوراً لتحديد موعد المعاينة" },
      { title: "معاينة مجانية", subtitle: "في موقعك", body: "يزورك أحد خبرائنا في الموعد المحدد لمعاينة الأثاث بشكل شامل وتقديم تقييم دقيق ومنصف" },
      { title: "عرض السعر", subtitle: "والتفاوض", body: "بعد المعاينة، نقدم لك السعر المناسب بناءً على حالة الأثاث وجودته مع إمكانية التفاوض" },
      { title: "الدفع الفوري", subtitle: "ونقل الأثاث", body: "بعد الاتفاق على السعر، نقوم بالدفع نقداً مباشرة ونتولى عملية نقل الأثاث دون أي تكلفة إضافية" },
    ],
    genericFaq: [
      { question: "كيف يتم تحديد سعر الأثاث المستعمل؟", answer: "نحدد السعر بناءً على عدة عوامل: نوع الأثاث (خشب، MDF، معدن)، حالته العامة، جودة التصنيع، الماركة إن وجدت، والطلب في السوق." },
      { question: "هل المعاينة مجانية؟ وهل هناك رسوم نقل؟", answer: "نعم، المعاينة مجانية تماماً في جميع مناطق عمان بدون أي تكلفة عليك. كما أن عملية النقل أيضاً مجانية - نحن نتحمل كافة تكاليف نقل الأثاث." },
      { question: "كم يستغرق من الوقت لإتمام عملية البيع؟", answer: "عملية البيع سريعة جداً! المعاينة تستغرق عادة 15-30 دقيقة، وبعد الاتفاق على السعر نقوم بالدفع فوراً ونقل الأثاث في نفس اليوم." },
    ],
    bullets: [
      "نشتري غرف النوم الكاملة بجميع أنواعها: خشب، MDF، تركي، صيني بأعلى الأسعار",
      "شراء الصالونات وأطقم الجلوس: جلد، قماش، شامواه بأسعار تنافسية جداً",
      "نشتري طاولات الطعام، الخزائن، المكتبات، والديكورات المنزلية بكافة أشكالها",
      "تقييم احترافي ودفع نقدي فوري - خدمة سريعة وموثوقة في جميع مناطق عمان",
    ],
    features: [
      { title: "أسعار تنافسية ومنصفة", body: "نقدم أفضل الأسعار في السوق بناءً على تقييم احترافي دقيق لحالة الأثاث وجودته ونوعه" },
      { title: "معاينة مجانية فورية", body: "نأتي إلى موقعك في أي منطقة في عمان لمعاينة الأثاث مجاناً وتقديم السعر المناسب" },
      { title: "دفع نقدي فوري", body: "نقوم بالدفع نقداً فوراً بعد الاتفاق على السعر - لا انتظار ولا تأخير في الدفع" },
    ],
    otherServices: [
      { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
      { label: "شراء أثاث مكتبي مستعمل", href: "/buy-used-office-furniture" as const },
      { label: "شراء أجهزة كهربائية مستعملة", href: "/buy-used-appliances" as const },
      { label: "إفراغ منازل بالكامل", href: "/house-clearance" as const },
      { label: "شراء أنتيكات وتحف", href: "/buy-antiques" as const },
      { label: "شراء مطابخ مستعملة", href: "/buy-used-kitchens" as const },
    ],
    howToTitle: "كيف تتم عملية الشراء؟",
    howToIntro: "نحن نسهل عليك عملية بيع أثاثك المستعمل من خلال أربع خطوات بسيطة وسريعة، مع الحفاظ على الشفافية الكاملة والمصداقية في التعامل.",
    otherServicesTitle: "خدمات أخرى",
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "احصل على أفضل سعر الآن",
    callCta: "اتصل بنا الآن",
    heroImageAlt: "شراء أثاث مستعمل في عمان",
    introImageAlt: "شراء اثاث مستعمل",
    featuresImageAlt: "شراء أجهزة كهربائية مستعملة",
  },
  en: {
    breadcrumbServices: "Services",
    howToSteps: [
      { title: "Call us or", subtitle: "Send Photos", body: "Call us at 0796983994 or send us photos of the furniture via WhatsApp. We'll reply right away to schedule an inspection" },
      { title: "Free Inspection", subtitle: "At Your Location", body: "One of our experts visits at the agreed time for a thorough inspection and an accurate, fair valuation" },
      { title: "Price Offer", subtitle: "and Negotiation", body: "After the inspection, we offer a fair price based on the furniture's condition and quality, open to negotiation" },
      { title: "Instant Payment", subtitle: "and Moving", body: "Once we agree on a price, we pay cash immediately and handle moving the furniture at no extra cost" },
    ],
    genericFaq: [
      { question: "How is the price of used furniture determined?", answer: "We consider several factors: the furniture type (wood, MDF, metal), overall condition, build quality, brand if any, and current market demand." },
      { question: "Is the inspection free? Are there moving fees?", answer: "Yes, the inspection is completely free across every area of Amman, at no cost to you. Moving is free too — we cover all furniture transport costs." },
      { question: "How long does the sale take to complete?", answer: "Very fast! The inspection usually takes 15-30 minutes, and once we agree on a price, we pay immediately and move the furniture the same day." },
    ],
    bullets: [
      "We buy complete bedrooms of every kind: wood, MDF, Turkish, Chinese, at the best prices",
      "Buying sofas and seating sets: leather, fabric, suede, at very competitive prices",
      "We buy dining tables, wardrobes, bookcases, and home décor of every shape",
      "Professional valuation and instant cash payment — fast, reliable service across every area of Amman",
    ],
    features: [
      { title: "Competitive, Fair Prices", body: "We offer the best market prices based on an accurate professional valuation of the furniture's condition, quality, and type" },
      { title: "Instant Free Inspection", body: "We come to your location anywhere in Amman for a free inspection and a fair price offer" },
      { title: "Instant Cash Payment", body: "We pay cash immediately once we agree on a price — no waiting, no payment delays" },
    ],
    otherServices: [
      { label: "Used Bedrooms", href: "/buy-used-bedrooms" as const },
      { label: "Used Office Furniture", href: "/buy-used-office-furniture" as const },
      { label: "Used Appliances", href: "/buy-used-appliances" as const },
      { label: "Full House Clearance", href: "/house-clearance" as const },
      { label: "Antiques & Artifacts", href: "/buy-antiques" as const },
      { label: "Used Kitchens", href: "/buy-used-kitchens" as const },
    ],
    howToTitle: "How does the buying process work?",
    howToIntro: "We make selling your used furniture easy with four simple, fast steps, while keeping the process fully transparent and honest.",
    otherServicesTitle: "Other Services",
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Get the best price now",
    callCta: "Call Us Now",
    heroImageAlt: "Buy used furniture in Amman",
    introImageAlt: "Buy used furniture",
    featuresImageAlt: "Buy used appliances",
  },
} as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/areas/[area]">) {
  const { locale, area: slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  return buildMetadata({
    title: locale === "en" ? area.metaTitleEn : area.metaTitle,
    description: locale === "en" ? area.metaDescriptionEn : area.metaDescription,
    path: `/buy-used-furniture-${area.slug}`,
    locale: locale as Locale,
  });
}

export default async function LocationPage({
  params,
}: PageProps<"/[locale]/areas/[area]">) {
  const { locale, area: slug } = await params;

  const area = getAreaBySlug(slug);
  if (!area) notFound();

  setRequestLocale(locale);
  const isEn = locale === "en";
  const c = content[locale as Locale];
  const areaName = isEn ? area.nameEn : area.nameAr;

  const pageTitle = isEn ? `Buy Used Furniture in ${areaName}` : `شراء أثاث مستعمل في ${areaName}`;
  const faq = isEn
    ? [{ question: area.faqQuestionEn, answer: area.faqAnswerEn }, ...c.genericFaq]
    : [{ question: area.faqQuestion, answer: area.faqAnswer }, ...c.genericFaq];

  return (
    <>
      <ServiceJsonLd
        serviceType={isEn ? area.serviceTypeEn : area.serviceType}
        name={isEn ? area.serviceNameEn : area.serviceName}
        description={isEn ? area.serviceDescriptionEn : area.serviceDescription}
        areaServedName={areaName}
        offerDescription={
          isEn
            ? `Free inspection and professional valuation of used furniture in ${areaName}`
            : `معاينة مجانية وتقييم احترافي للأثاث المستعمل في ${areaName}`
        }
      />
      <BreadcrumbJsonLd
        items={[
          { name: c.breadcrumbServices, path: "/services" },
          { name: pageTitle, path: `/buy-used-furniture-${area.slug}` },
        ]}
      />
      <FaqJsonLd items={faq} />
      <HowToJsonLd
        name={
          isEn
            ? `How to sell your used furniture to Aldabouqi in ${areaName}`
            : `كيف تبيع أثاثك المستعمل للدابوقي في ${areaName}`
        }
        description={
          isEn
            ? `Simple steps to sell your used furniture in ${areaName} for the best price`
            : `خطوات بسيطة لبيع أثاثك المستعمل في ${areaName} بأفضل سعر`
        }
        steps={c.howToSteps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: `/buy-used-furniture-${area.slug}`, label: pageTitle },
        ]}
        heroImage={{ src: "/img/service/aldabouqi6.webp", alt: `${pageTitle} - ${c.heroImageAlt}` }}
        introTitle={isEn ? `Buying All Types of Used Furniture in ${areaName}` : `شراء جميع أنواع الأثاث المستعمل في ${areaName}`}
        introBody={isEn ? area.introEn : area.intro}
        introImage={{ src: "/img/service/aldabouqi2.webp", alt: c.introImageAlt }}
        bullets={[...c.bullets]}
        features={[...c.features]}
        featuresImage={{ src: "/img/service/aldabouqi1.webp", alt: c.featuresImageAlt }}
        howToTitle={c.howToTitle}
        howToIntro={c.howToIntro}
        steps={[...c.howToSteps]}
        faqTitle={isEn ? `FAQ about Buying Used Furniture in ${areaName}` : `الأسئلة الشائعة حول شراء الأثاث المستعمل في ${areaName}`}
        faq={faq}
        otherServicesTitle={c.otherServicesTitle}
        otherServices={[...c.otherServices]}
        experienceLabel={c.experienceLabel}
        ctaTitle={c.ctaTitle}
        callCta={c.callCta}
      />
    </>
  );
}
