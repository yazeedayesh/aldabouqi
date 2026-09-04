import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شراء عفش وأثاث منزلي مستعمل في عمان | أفضل الأسعار - الدابوقي",
    metaDescription:
      "نشتري العفش والأثاث المنزلي المستعمل في عمان: غرف نوم، صالونات، طاولات، كنب، خزائن. معاينة مجانية وتقييم فوري ودفع نقدي في موقعك. اتصل الآن: 0796983994",
    keywords:
      "شراء أثاث منزلي مستعمل عمان, عفش بيت مستعمل للبيع, بيع اثاث مستعمل, شراء عفش مستعمل الاردن, محلات شراء الاثاث المستعمل, اثاث منزلي للبيع, شراء غرف نوم مستعملة, شراء صالونات مستعملة, الدابوقي, شراء كنب مستعمل",
    pageTitle: "شراء أثاث منزلي مستعمل",
    breadcrumbServices: "خدماتنا",
    serviceType: "شراء أثاث منزلي مستعمل",
    serviceName: "خدمة شراء الأثاث المنزلي المستعمل في عمان",
    serviceDescription:
      "نشتري جميع أنواع الأثاث المنزلي المستعمل: غرف نوم، صالونات، طاولات طعام، كنب، خزائن ملابس، مكتبات، ديكورات منزلية وكل ما يتعلق بالمنزل بأفضل الأسعار في السوق الأردني",
    offerDescription: "معاينة مجانية وتقييم احترافي للأثاث المنزلي المستعمل",
    introTitle: "شراء جميع أنواع الأثاث المنزلي المستعمل في عمان",
    introBody:
      "نحن في شركة الدابوقي نقدم خدمات شراء الأثاث المنزلي المستعمل بأفضل الأسعار في السوق الأردني. مع خبرة تمتد لأكثر من 60 عاماً، أصبحنا الخيار الأول لآلاف العائلات في عمان الذين يرغبون ببيع أثاثهم المستعمل بطريقة سريعة وآمنة ومربحة. نشتري جميع أنواع الأثاث المنزلي بغض النظر عن حالته: غرف نوم كاملة، صالونات وأطقم جلوس، طاولات طعام، خزائن ملابس، مكتبات، أسرّة، مراتب، ستائر، سجاد، ديكورات منزلية وكل ما يتعلق بالمنزل. فريقنا المتخصص يقوم بمعاينة الأثاث في موقعك، تقديم تقييم عادل ومنصف، والدفع نقداً فوراً بعد الاتفاق.",
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
    howToTitle: "كيف تتم عملية الشراء؟",
    howToIntro:
      "نحن نسهل عليك عملية بيع أثاثك المستعمل من خلال أربع خطوات بسيطة وسريعة، مع الحفاظ على الشفافية الكاملة والمصداقية في التعامل.",
    steps: [
      { title: "اتصل بنا أو", subtitle: "أرسل صور الأثاث", body: "اتصل على رقمنا 0796983994 أو أرسل لنا صوراً للأثاث عبر الواتساب. سنقوم بالرد عليك فوراً لتحديد موعد المعاينة" },
      { title: "معاينة مجانية", subtitle: "في موقعك", body: "يزورك أحد خبرائنا في الموعد المحدد لمعاينة الأثاث بشكل شامل وتقديم تقييم دقيق ومنصف" },
      { title: "عرض السعر", subtitle: "والتفاوض", body: "بعد المعاينة، نقدم لك السعر المناسب بناءً على حالة الأثاث وجودته مع إمكانية التفاوض" },
      { title: "الدفع الفوري", subtitle: "ونقل الأثاث", body: "بعد الاتفاق على السعر، نقوم بالدفع نقداً مباشرة ونتولى عملية نقل الأثاث دون أي تكلفة إضافية" },
    ],
    faqTitle: "الأسئلة الشائعة حول شراء الأثاث المنزلي المستعمل",
    faq: [
      { question: "هل تشترون جميع أنواع الأثاث المنزلي؟", answer: "نعم، نشتري جميع أنواع الأثاث المنزلي بغض النظر عن نوعه أو حالته: غرف نوم، صالونات، طاولات طعام، كنب، خزائن ملابس، مكتبات، ديكورات منزلية، سجاد، ستائر وكل ما يتعلق بالمنزل." },
      { question: "كيف يتم تحديد سعر الأثاث المستعمل؟", answer: "نحدد السعر بناءً على عدة عوامل: نوع الأثاث (خشب، MDF، معدن)، حالته العامة، جودة التصنيع، الماركة إن وجدت، والطلب في السوق." },
      { question: "هل المعاينة مجانية؟ وهل هناك رسوم نقل؟", answer: "نعم، المعاينة مجانية تماماً في جميع مناطق عمان بدون أي تكلفة عليك. كما أن عملية النقل أيضاً مجانية - نحن نتحمل كافة تكاليف نقل الأثاث." },
      { question: "كم يستغرق من الوقت لإتمام عملية البيع؟", answer: "عملية البيع سريعة جداً! المعاينة تستغرق عادة 15-30 دقيقة، وبعد الاتفاق على السعر نقوم بالدفع فوراً ونقل الأثاث في نفس اليوم." },
    ],
    otherServicesTitle: "خدمات أخرى",
    otherServices: [
      { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
      { label: "شراء أثاث مكتبي مستعمل", href: "/buy-used-office-furniture" as const },
      { label: "شراء أجهزة كهربائية مستعملة" },
      { label: "إفراغ منازل بالكامل" },
      { label: "شراء أنتيكات وتحف" },
      { label: "شراء مطابخ مستعملة" },
    ],
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "احصل على أفضل سعر الآن",
    callCta: "اتصل بنا الآن",
  },
  en: {
    metaTitle: "Used Home Furniture in Amman | Aldabouqi - Best Prices, Instant Service",
    metaDescription:
      "We buy all types of used home furniture in Amman: bedrooms, sofas, tables, cabinets. Free inspection, professional valuation, instant cash payment. Call now: 0796983994",
    keywords:
      "used home furniture Amman, sell used furniture, buy used furniture Jordan, furniture buying shops Amman, home furniture for sale, used bedrooms, used sofas, Aldabouqi, sell used sofa, used furniture Amman",
    pageTitle: "Used Home Furniture",
    breadcrumbServices: "Services",
    serviceType: "Used Home Furniture Buying",
    serviceName: "Used Home Furniture Buying Service in Amman",
    serviceDescription:
      "We buy all types of used home furniture: bedrooms, sofas, dining tables, cabinets, bookshelves, home decor and everything related to the home at the best prices in the Jordanian market",
    offerDescription: "Free inspection and professional valuation of used home furniture",
    introTitle: "Buying All Types of Used Home Furniture in Amman",
    introBody:
      "At Aldabouqi we offer used home furniture buying services at the best prices in the Jordanian market. With over 60 years of experience, we've become the first choice for thousands of families in Amman looking to sell their furniture quickly, safely, and profitably. We buy all types of home furniture regardless of condition: complete bedrooms, sofas and seating sets, dining tables, wardrobes, bookshelves, beds, mattresses, curtains, carpets, home decor and everything related to the home.",
    bullets: [
      "We buy complete bedrooms of every kind: wood, MDF, Turkish, Chinese, at the best prices",
      "Buying sofas and seating sets: leather, fabric, suede, at very competitive prices",
      "We buy dining tables, cabinets, bookshelves, and home decor of every kind",
      "Professional valuation and instant cash payment - fast, reliable service across all Amman areas",
    ],
    features: [
      { title: "Competitive, Fair Prices", body: "We offer the best prices in the market based on an accurate professional valuation of the furniture's condition, quality, and type" },
      { title: "Instant Free Inspection", body: "We come to your location anywhere in Amman for a free inspection and a fair price offer" },
      { title: "Instant Cash Payment", body: "We pay cash instantly once we agree on a price - no waiting, no delays" },
    ],
    howToTitle: "How does the buying process work?",
    howToIntro:
      "We make selling your used furniture easy with four simple, fast steps, while maintaining complete transparency and integrity.",
    steps: [
      { title: "Call us or", subtitle: "Send Furniture Photos", body: "Call us at 0796983994 or send us photos via WhatsApp. We'll reply right away to schedule an inspection" },
      { title: "Free Inspection", subtitle: "at your location", body: "One of our experts visits at the agreed time for a thorough inspection and an accurate, fair valuation" },
      { title: "Price Offer", subtitle: "and Negotiation", body: "After the inspection, we offer a fair price based on the furniture's condition and quality, with room to negotiate" },
      { title: "Instant Payment", subtitle: "and Furniture Moving", body: "Once we agree on a price, we pay cash immediately and handle moving the furniture at no extra cost" },
    ],
    faqTitle: "FAQ about Buying Used Home Furniture",
    faq: [
      { question: "Do you buy all types of home furniture?", answer: "Yes, we buy all types of home furniture regardless of type or condition: bedrooms, sofas, dining tables, cabinets, wardrobes, bookshelves, home decor, carpets, curtains." },
      { question: "How is the price of used furniture determined?", answer: "We set the price based on several factors: furniture type, overall condition, craftsmanship quality, brand if any, and market demand." },
      { question: "Is the inspection free? Are there any moving fees?", answer: "Yes, the inspection is completely free across all Amman areas. Moving is free too — we cover all costs of moving the furniture." },
      { question: "How long does the selling process take?", answer: "The process is very fast! Inspection usually takes 15-30 minutes, and once we agree on a price, we pay instantly and move the furniture the same day." },
    ],
    otherServicesTitle: "Other Services",
    otherServices: [
      { label: "Used Bedrooms", href: "/buy-used-bedrooms" as const },
      { label: "Used Office Furniture", href: "/buy-used-office-furniture" as const },
      { label: "Used Appliances" },
      { label: "Full House Clearance" },
      { label: "Antiques & Artifacts" },
      { label: "Used Kitchens" },
    ],
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Get the best price now",
    callCta: "Call Us Now",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/buy-used-home-furniture">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/buy-used-home-furniture",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/service/buy-home-furniture.jpg`,
  });
}

export default async function BuyUsedHomeFurniturePage({
  params,
}: PageProps<"/[locale]/buy-used-home-furniture">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  return (
    <>
      <ServiceJsonLd
        serviceType={c.serviceType}
        name={c.serviceName}
        description={c.serviceDescription}
        areaServedName="عمان"
        offerDescription={c.offerDescription}
      />
      <BreadcrumbJsonLd
        items={[
          { name: c.breadcrumbServices, path: "/services" },
          { name: c.pageTitle, path: "/buy-used-home-furniture" },
        ]}
      />
      <FaqJsonLd items={c.faq} />
      <HowToJsonLd
        name={locale === "en" ? "How to sell your used home furniture to Aldabouqi" : "كيف تبيع أثاثك المنزلي المستعمل للدابوقي"}
        description={locale === "en" ? "Simple steps to sell your used home furniture for the best price" : "خطوات بسيطة لبيع أثاثك المنزلي المستعمل بأفضل سعر"}
        steps={c.steps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={c.pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: "/buy-used-home-furniture", label: c.pageTitle },
        ]}
        introTitle={c.introTitle}
        introBody={c.introBody}
        bullets={[...c.bullets]}
        features={[...c.features]}
        howToTitle={c.howToTitle}
        howToIntro={c.howToIntro}
        steps={[...c.steps]}
        faqTitle={c.faqTitle}
        faq={[...c.faq]}
        otherServicesTitle={c.otherServicesTitle}
        otherServices={[...c.otherServices]}
        experienceLabel={c.experienceLabel}
        ctaTitle={c.ctaTitle}
        callCta={c.callCta}
      />
    </>
  );
}
