import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { areas, getAreaBySlug } from "@/lib/areas";
import type { Locale } from "@/i18n/routing";

// Lives at the internal path /areas/[area]; proxy.ts rewrites the public
// URL /buy-used-furniture-[area] to this route, since Next.js dynamic
// segments can't mix a literal prefix with a bracket inside one folder
// name (confirmed empirically — see proxy.ts comment for details).
//
// No English variant — the 72 vercel.json redirects already consolidate
// /en/buy-used-furniture-[area] into the Arabic URL. Excluding "en" here
// (rather than only guarding in the component) keeps Next from ever
// generating an /en/areas/[area] page at build time.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (params.locale !== "ar") return [];
  return areas.map((a) => ({ area: a.slug }));
}

const howToSteps = [
  { title: "اتصل بنا أو", subtitle: "أرسل صور الأثاث", body: "اتصل على رقمنا 0796983994 أو أرسل لنا صوراً للأثاث عبر الواتساب. سنقوم بالرد عليك فوراً لتحديد موعد المعاينة" },
  { title: "معاينة مجانية", subtitle: "في موقعك", body: "يزورك أحد خبرائنا في الموعد المحدد لمعاينة الأثاث بشكل شامل وتقديم تقييم دقيق ومنصف" },
  { title: "عرض السعر", subtitle: "والتفاوض", body: "بعد المعاينة، نقدم لك السعر المناسب بناءً على حالة الأثاث وجودته مع إمكانية التفاوض" },
  { title: "الدفع الفوري", subtitle: "ونقل الأثاث", body: "بعد الاتفاق على السعر، نقوم بالدفع نقداً مباشرة ونتولى عملية نقل الأثاث دون أي تكلفة إضافية" },
];

const genericFaq = [
  { question: "كيف يتم تحديد سعر الأثاث المستعمل؟", answer: "نحدد السعر بناءً على عدة عوامل: نوع الأثاث (خشب، MDF، معدن)، حالته العامة، جودة التصنيع، الماركة إن وجدت، والطلب في السوق." },
  { question: "هل المعاينة مجانية؟ وهل هناك رسوم نقل؟", answer: "نعم، المعاينة مجانية تماماً في جميع مناطق عمان بدون أي تكلفة عليك. كما أن عملية النقل أيضاً مجانية - نحن نتحمل كافة تكاليف نقل الأثاث." },
  { question: "كم يستغرق من الوقت لإتمام عملية البيع؟", answer: "عملية البيع سريعة جداً! المعاينة تستغرق عادة 15-30 دقيقة، وبعد الاتفاق على السعر نقوم بالدفع فوراً ونقل الأثاث في نفس اليوم." },
];

const bullets = [
  "نشتري غرف النوم الكاملة بجميع أنواعها: خشب، MDF، تركي، صيني بأعلى الأسعار",
  "شراء الصالونات وأطقم الجلوس: جلد، قماش، شامواه بأسعار تنافسية جداً",
  "نشتري طاولات الطعام، الخزائن، المكتبات، والديكورات المنزلية بكافة أشكالها",
  "تقييم احترافي ودفع نقدي فوري - خدمة سريعة وموثوقة في جميع مناطق عمان",
];

const features = [
  { title: "أسعار تنافسية ومنصفة", body: "نقدم أفضل الأسعار في السوق بناءً على تقييم احترافي دقيق لحالة الأثاث وجودته ونوعه" },
  { title: "معاينة مجانية فورية", body: "نأتي إلى موقعك في أي منطقة في عمان لمعاينة الأثاث مجاناً وتقديم السعر المناسب" },
  { title: "دفع نقدي فوري", body: "نقوم بالدفع نقداً فوراً بعد الاتفاق على السعر - لا انتظار ولا تأخير في الدفع" },
];

const otherServices = [
  { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
  { label: "شراء أثاث مكتبي مستعمل", href: "/buy-used-office-furniture" as const },
  { label: "شراء أجهزة كهربائية مستعملة" },
  { label: "إفراغ منازل بالكامل" },
  { label: "شراء أنتيكات وتحف" },
  { label: "شراء مطابخ مستعملة" },
];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/areas/[area]">) {
  const { locale, area: slug } = await params;
  if (locale !== "ar") return {};
  const area = getAreaBySlug(slug);
  if (!area) return {};

  return buildMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: `/buy-used-furniture-${area.slug}`,
    locale: locale as Locale,
    hasEnglishVariant: false,
  });
}

export default async function LocationPage({
  params,
}: PageProps<"/[locale]/areas/[area]">) {
  const { locale, area: slug } = await params;
  if (locale !== "ar") notFound();

  const area = getAreaBySlug(slug);
  if (!area) notFound();

  setRequestLocale(locale);

  const pageTitle = `شراء أثاث مستعمل في ${area.nameAr}`;
  const faq = [{ question: area.faqQuestion, answer: area.faqAnswer }, ...genericFaq];

  return (
    <>
      <ServiceJsonLd
        serviceType={area.serviceType}
        name={area.serviceName}
        description={area.serviceDescription}
        areaServedName={area.nameAr}
        offerDescription={`معاينة مجانية وتقييم احترافي للأثاث المستعمل في ${area.nameAr}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "خدماتنا", path: "/services" },
          { name: pageTitle, path: `/buy-used-furniture-${area.slug}` },
        ]}
      />
      <FaqJsonLd items={faq} />
      <HowToJsonLd
        name={`كيف تبيع أثاثك المستعمل للدابوقي في ${area.nameAr}`}
        description={`خطوات بسيطة لبيع أثاثك المستعمل في ${area.nameAr} بأفضل سعر`}
        steps={howToSteps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={pageTitle}
        breadcrumbs={[
          { href: "/services", label: "خدماتنا" },
          { href: `/buy-used-furniture-${area.slug}`, label: pageTitle },
        ]}
        introTitle={`شراء جميع أنواع الأثاث المستعمل في ${area.nameAr}`}
        introBody={area.intro}
        bullets={bullets}
        features={features}
        howToTitle="كيف تتم عملية الشراء؟"
        howToIntro="نحن نسهل عليك عملية بيع أثاثك المستعمل من خلال أربع خطوات بسيطة وسريعة، مع الحفاظ على الشفافية الكاملة والمصداقية في التعامل."
        steps={howToSteps}
        faqTitle={`الأسئلة الشائعة حول شراء الأثاث المستعمل في ${area.nameAr}`}
        faq={faq}
        otherServicesTitle="خدمات أخرى"
        otherServices={otherServices}
        experienceLabel="خبرة +60 سنة"
        ctaTitle="احصل على أفضل سعر الآن"
        callCta="اتصل بنا الآن"
      />
    </>
  );
}
