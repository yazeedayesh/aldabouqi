import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شراء مطابخ مستعملة في عمان | الدابوقي",
    metaDescription:
      "نشتري المطابخ المستعملة في عمان بجميع الأحجام والتصاميم: خشب، ألمنيوم، فورمايكا. تقييم فوري وسعر عادل، فك ونقل مجاني. اتصل: 0796983994",
    keywords:
      "شراء مطبخ مستعمل عمان, بيع مطبخ الماني مستعمل, شراء مطابخ فورمايكا, بيع مطبخ خشب مستعمل, محلات شراء مطابخ عمان, تفكيك مطبخ مستعمل",
    pageTitle: "شراء مطابخ مستعملة",
    breadcrumbServices: "خدماتنا",
    serviceType: "شراء مطابخ مستعملة",
    serviceName: "خدمة شراء المطابخ المستعملة في عمان",
    serviceDescription:
      "نشتري المطابخ المستعملة بكافة الأحجام والتصاميم: خشب، ألمنيوم، فورمايكا، وجميع الخامات، بمعاينة فورية وتقييم عادل يراعي حالة الوحدات والرخام والتجهيزات.",
    offerDescription: "معاينة مجانية وتقييم فوري للمطابخ المستعملة مع فك ونقل مجاني",
    heroImageAlt: "مطبخ مستعمل للبيع",
    introImageAlt: "شراء مطابخ مستعملة عمان",
    introTitle: "شراء جميع أنواع المطابخ المستعملة بأعلى الأسعار",
    introBody:
      "نشتري المطابخ المستعملة بمختلف الخامات والتصاميم: خشب طبيعي، MDF، ألمنيوم، وفورمايكا بجميع الألوان والأحجام. نفحص حالة الوحدات والرخام والتجهيزات المرفقة قبل تقديم سعر عادل، ونتولى الفك والنقل بأنفسنا لتجنب أي أضرار.",
    bullets: [
      "نشتري مطابخ الخشب والMDF والألمنيوم والفورمايكا بجميع الأحجام",
      "نشتري المطابخ مع أو بدون الرخام والتجهيزات",
      "نشتري المطابخ الناقصة أو التي تحتاج ترميم بسيط — تقييم عادل لكل حالة",
      "فك احترافي وآمن، معاينة فورية، ودفع نقدي",
    ],
    features: [
      { title: "فك احترافي وآمن", body: "فريقنا متخصص بفك المطابخ بدون إتلاف الوحدات أو الجدران" },
      { title: "تقييم شامل", body: "نراعي حالة الوحدات، الرخام، والتجهيزات المرفقة عند التسعير" },
      { title: "نقل مجاني بالكامل", body: "ننقل المطبخ بكل أجزائه بدون أي تكلفة إضافية عليك" },
    ],
    howToTitle: "كيف تبيع مطبخك المستعمل؟",
    howToIntro: "عملية منظمة تضمن فك آمن وسعر عادل.",
    steps: [
      { title: "اتصل بنا أو", subtitle: "أرسل صور المطبخ", body: "أرسل لنا صوراً واضحة للمطبخ من زوايا مختلفة عبر الواتساب" },
      { title: "معاينة فورية", subtitle: "وفحص دقيق", body: "يزورك فريقنا لفحص الوحدات والرخام والتجهيزات المرفقة" },
      { title: "عرض السعر", subtitle: "والتفاوض", body: "نقدم سعراً عادلاً بناءً على حالة المطبخ، مع إمكانية التفاوض" },
      { title: "الدفع والفك", subtitle: "والنقل", body: "دفع نقدي مباشر، وفك احترافي وآمن، ونقل بدون أي تكلفة" },
    ],
    faqTitle: "الأسئلة الشائعة حول شراء المطابخ المستعملة",
    faq: [
      { question: "هل تشترون جميع أنواع المطابخ؟", answer: "نعم، نشتري مطابخ الخشب، MDF، الألمنيوم، والفورمايكا بجميع الأحجام والتصاميم." },
      { question: "هل تشترون المطبخ مع الرخام والتجهيزات؟", answer: "نعم، نقيّم المطبخ مع الرخام والتجهيزات المرفقة إن وجدت، وهذا يؤثر إيجاباً على السعر." },
      { question: "من يتولى فك المطبخ؟", answer: "فريقنا المتخصص يتولى الفك بالكامل بطريقة آمنة تحافظ على الوحدات والجدران." },
      { question: "هل تشترون المطابخ التي تحتاج ترميم؟", answer: "نعم، نشتري المطابخ التي تحتاج ترميم بسيط، مع تقييم يعكس حالتها الفعلية." },
    ],
    otherServicesTitle: "خدمات أخرى",
    otherServices: [
      { label: "شراء أثاث منزلي مستعمل", href: "/buy-used-home-furniture" as const },
      { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
      { label: "شراء أجهزة كهربائية مستعملة", href: "/buy-used-appliances" as const },
      { label: "إفراغ منازل بالكامل", href: "/house-clearance" as const },
      { label: "شراء أنتيكات وتحف", href: "/buy-antiques" as const },
      { label: "شراء صالونات مستعملة", href: "/buy-used-sofas" as const },
    ],
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "بدك تبيع مطبخك المستعمل؟ احصل على تقييم فوري",
    callCta: "اتصل بنا الآن",
  },
  en: {
    metaTitle: "Used Kitchens in Amman | Wood, Aluminum, Formica - Aldabouqi",
    metaDescription:
      "We buy used kitchens in Amman, every size and design: wood, aluminum, formica. Instant valuation, free disassembly and moving. Call: 0796983994",
    keywords:
      "sell used kitchen Amman, buy used kitchen cabinets, formica kitchen buying, sell wooden kitchen used, kitchen buying shops Amman, used kitchen disassembly",
    pageTitle: "Used Kitchens",
    breadcrumbServices: "Services",
    serviceType: "Used Kitchens Buying",
    serviceName: "Used Kitchens Buying Service in Amman",
    serviceDescription:
      "We buy used kitchens of every size and design: wood, aluminum, formica, and every material, with an instant inspection and a fair valuation that accounts for the cabinets, countertop, and fittings.",
    offerDescription: "Free inspection and instant valuation of used kitchens, with free disassembly and moving",
    heroImageAlt: "Used kitchen for sale",
    introImageAlt: "Buying Used Kitchens Amman",
    introTitle: "Buying All Types of Used Kitchens at the Best Prices",
    introBody:
      "We buy used kitchens in every material and design: solid wood, MDF, aluminum, and formica in every color and size. We check the cabinets, countertop, and attached fittings before offering a fair price, and we handle disassembly and moving ourselves to avoid any damage.",
    bullets: [
      "We buy wood, MDF, aluminum, and formica kitchens of every size",
      "We buy kitchens with or without the countertop and fittings",
      "We buy incomplete kitchens or ones needing minor repair — a fair valuation for every condition",
      "Professional, safe disassembly, instant inspection, and cash payment",
    ],
    features: [
      { title: "Professional, Safe Disassembly", body: "Our team specializes in disassembling kitchens without damaging cabinets or walls" },
      { title: "Comprehensive Valuation", body: "We account for the cabinets, countertop, and attached fittings when pricing" },
      { title: "Fully Free Moving", body: "We move the entire kitchen at no extra cost to you" },
    ],
    howToTitle: "How to sell your used kitchen?",
    howToIntro: "An organized process that guarantees safe disassembly and a fair price.",
    steps: [
      { title: "Call us or", subtitle: "Send Photos", body: "Send us clear photos of the kitchen from different angles via WhatsApp" },
      { title: "Instant Inspection", subtitle: "and Accurate Check", body: "Our team visits to check the cabinets, countertop, and attached fittings" },
      { title: "Price Offer", subtitle: "and Negotiation", body: "We offer a fair price based on the kitchen's condition, with room to negotiate" },
      { title: "Payment & Disassembly", subtitle: "and Moving", body: "Cash payment on the spot, professional safe disassembly, and moving at no cost" },
    ],
    faqTitle: "FAQ about Buying Used Kitchens",
    faq: [
      { question: "Do you buy all types of kitchens?", answer: "Yes, we buy wood, MDF, aluminum, and formica kitchens of every size and design." },
      { question: "Do you buy the kitchen with the countertop and fittings?", answer: "Yes, we value the kitchen with the countertop and attached fittings if present, which positively affects the price." },
      { question: "Who handles the kitchen disassembly?", answer: "Our specialized team handles the entire disassembly safely, preserving the cabinets and walls." },
      { question: "Do you buy kitchens that need repair?", answer: "Yes, we buy kitchens that need minor repair, with a valuation reflecting their actual condition." },
    ],
    otherServicesTitle: "Other Services",
    otherServices: [
      { label: "Used Home Furniture", href: "/buy-used-home-furniture" as const },
      { label: "Used Bedrooms", href: "/buy-used-bedrooms" as const },
      { label: "Used Appliances", href: "/buy-used-appliances" as const },
      { label: "Full House Clearance", href: "/house-clearance" as const },
      { label: "Antiques & Artifacts", href: "/buy-antiques" as const },
      { label: "Used Sofas", href: "/buy-used-sofas" as const },
    ],
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Want to sell your used kitchen? Get an instant valuation",
    callCta: "Call Us Now",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/buy-used-kitchens">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/buy-used-kitchens",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/service/aldabouqi3.webp`,
  });
}

export default async function BuyUsedKitchensPage({ params }: PageProps<"/[locale]/buy-used-kitchens">) {
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
          { name: c.pageTitle, path: "/buy-used-kitchens" },
        ]}
      />
      <FaqJsonLd items={c.faq} />
      <HowToJsonLd
        name={locale === "en" ? "How to sell your used kitchen to Aldabouqi" : "كيف تبيع مطبخك المستعمل للدابوقي"}
        description={locale === "en" ? "Simple steps to sell your used kitchen" : "خطوات بسيطة لبيع مطبخك المستعمل"}
        steps={c.steps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={c.pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: "/buy-used-kitchens", label: c.pageTitle },
        ]}
        heroImage={{ src: "/img/service/aldabouqi3.webp", alt: c.heroImageAlt }}
        introTitle={c.introTitle}
        introBody={c.introBody}
        introImage={{ src: "/img/service/aldabouqi5.webp", alt: c.introImageAlt }}
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
