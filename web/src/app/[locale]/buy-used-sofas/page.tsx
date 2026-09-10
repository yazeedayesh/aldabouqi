import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شراء صالونات وكنب مستعمل في عمان | الدابوقي",
    metaDescription:
      "نشتري الصالونات وأطقم الجلوس المستعملة في عمان: أمريكي، تركي، محلي، بجميع الأحجام. معاينة مجانية، تقييم عادل، دفع نقدي فوري. اتصل: 0796983994",
    keywords:
      "شراء صالون مستعمل عمان, بيع كنب مستعمل, شراء طقم جلوس مستعمل, صالونات تركي مستعملة, بيع اريكة مستعملة, محلات شراء كنب عمان",
    pageTitle: "شراء صالونات وكنب مستعمل",
    breadcrumbServices: "خدماتنا",
    serviceType: "شراء صالونات وكنب مستعمل",
    serviceName: "خدمة شراء الصالونات وأطقم الجلوس المستعملة في عمان",
    serviceDescription:
      "نشتري الصالونات والكنب وأطقم الجلوس المستعملة بجميع الأنواع: أمريكي، تركي، محلي، جلد وقماش، بمعاينة مجانية وتقييم عادل لحالة القماش والحشوة والهيكل.",
    offerDescription: "معاينة مجانية وتقييم احترافي للصالونات وأطقم الجلوس المستعملة",
    heroImageAlt: "صالونات وكنب مستعمل للبيع",
    introImageAlt: "شراء صالونات مستعملة عمان",
    introTitle: "شراء جميع أنواع الصالونات وأطقم الجلوس المستعملة",
    introBody:
      "نشتري الصالونات والكنب المستعمل بجميع الأنواع والأحجام: أطقم أمريكي، تركي، محلي، جلد طبيعي أو صناعي، وقماش بكل الألوان والتصاميم. نفحص حالة الحشوة والقماش والهيكل الخشبي قبل تقديم سعر عادل يناسب حالة القطعة الفعلية.",
    bullets: [
      "نشتري أطقم الجلوس الأمريكي والتركي والمحلي بجميع الأحجام",
      "نشتري الكنب الجلد والقماش بحالات مختلفة",
      "نشتري الصالونات الناقصة أو التي تحتاج تنجيد — تقييم عادل لكل حالة",
      "معاينة مجانية فورية، دفع نقدي، ونقل مجاني",
    ],
    features: [
      { title: "فحص شامل للحالة", body: "نفحص الحشوة والقماش والهيكل الخشبي لتقديم سعر يعكس الحالة الفعلية" },
      { title: "أسعار تنافسية", body: "نقدم أسعاراً عادلة تناسب نوع القماش والحجم وحالة الاستخدام" },
      { title: "نقل آمن ومجاني", body: "فريقنا يتولى نقل الصالونات الكبيرة بعناية وبدون أي تكلفة إضافية" },
    ],
    howToTitle: "كيف تبيع صالونك المستعمل؟",
    howToIntro: "عملية بسيطة تضمن لك أفضل سعر بأقل وقت.",
    steps: [
      { title: "اتصل بنا أو", subtitle: "أرسل صور الصالون", body: "أرسل لنا صوراً واضحة للصالون من زوايا مختلفة عبر الواتساب" },
      { title: "معاينة مجانية", subtitle: "وفحص دقيق", body: "يزورك خبير لفحص القماش والحشوة والهيكل عن قرب" },
      { title: "عرض السعر", subtitle: "والتفاوض", body: "نقدم سعراً عادلاً بناءً على الحالة الفعلية، مع إمكانية التفاوض" },
      { title: "الدفع الفوري", subtitle: "والنقل", body: "دفع نقدي مباشر، ونقل الصالون مجاناً بمعدات مناسبة" },
    ],
    faqTitle: "الأسئلة الشائعة حول شراء الصالونات المستعملة",
    faq: [
      { question: "هل تشترون جميع أنواع الصالونات؟", answer: "نعم، نشتري أطقم الجلوس الأمريكي، التركي، والمحلي، بالجلد أو القماش، وبجميع الأحجام." },
      { question: "كيف تحددون سعر الصالون المستعمل؟", answer: "حسب نوع القماش أو الجلد، حالة الحشوة، متانة الهيكل الخشبي، والحجم." },
      { question: "هل تشترون الصالون اللي يحتاج تنجيد؟", answer: "نعم، نشتري الصالونات التي تحتاج تنجيد أو صيانة بسيطة، مع اختلاف السعر حسب الحالة." },
      { question: "هل النقل مجاني؟", answer: "نعم، فريقنا يتولى نقل الصالونات الكبيرة بدون أي تكلفة إضافية عليك." },
    ],
    otherServicesTitle: "خدمات أخرى",
    otherServices: [
      { label: "شراء أثاث منزلي مستعمل", href: "/buy-used-home-furniture" as const },
      { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
      { label: "شراء أجهزة كهربائية مستعملة", href: "/buy-used-appliances" as const },
      { label: "إفراغ منازل بالكامل", href: "/house-clearance" as const },
      { label: "شراء أنتيكات وتحف", href: "/buy-antiques" as const },
      { label: "شراء مطابخ مستعملة", href: "/buy-used-kitchens" as const },
    ],
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "بدك تبيع صالونك؟ احصل على أفضل سعر الآن",
    callCta: "اتصل بنا الآن",
  },
  en: {
    metaTitle: "Used Sofas & Seating Sets in Amman | Aldabouqi",
    metaDescription:
      "We buy used sofas and seating sets in Amman: American, Turkish, local, every size. Free inspection, fair valuation, instant cash payment. Call: 0796983994",
    keywords:
      "sell used sofa Amman, buy used seating set, used sofa buying Amman, Turkish sofa used, sell used couch, sofa buying shops Amman",
    pageTitle: "Used Sofas & Seating Sets",
    breadcrumbServices: "Services",
    serviceType: "Used Sofas & Seating Sets Buying",
    serviceName: "Used Sofas & Seating Sets Buying Service in Amman",
    serviceDescription:
      "We buy used sofas and seating sets of every kind: American, Turkish, local, leather and fabric, with a free inspection and a fair valuation of the fabric, cushioning, and frame condition.",
    offerDescription: "Free inspection and professional valuation of used sofas and seating sets",
    heroImageAlt: "Used sofas and seating sets for sale",
    introImageAlt: "Buying Used Sofas Amman",
    introTitle: "Buying All Types of Used Sofas and Seating Sets",
    introBody:
      "We buy used sofas and seating sets of every type and size: American, Turkish, local sets, genuine or faux leather, and fabric in every color and design. We check the cushioning, fabric, and wooden frame before offering a fair price that reflects the piece's actual condition.",
    bullets: [
      "We buy American, Turkish, and local seating sets of every size",
      "We buy leather and fabric sofas in various conditions",
      "We buy incomplete sofas or ones needing reupholstering — a fair valuation for every condition",
      "Instant free inspection, cash payment, and free moving",
    ],
    features: [
      { title: "Thorough Condition Check", body: "We check the cushioning, fabric, and wooden frame to offer a price reflecting the actual condition" },
      { title: "Competitive Prices", body: "We offer fair prices suited to the fabric type, size, and usage condition" },
      { title: "Safe, Free Moving", body: "Our team moves large sofas with care, at no extra cost" },
    ],
    howToTitle: "How to sell your used sofa?",
    howToIntro: "A simple process that gets you the best price in the least time.",
    steps: [
      { title: "Call us or", subtitle: "Send Photos", body: "Send us clear photos of the sofa from different angles via WhatsApp" },
      { title: "Free Inspection", subtitle: "and Accurate Check", body: "An expert visits to closely check the fabric, cushioning, and frame" },
      { title: "Price Offer", subtitle: "and Negotiation", body: "We offer a fair price based on the actual condition, with room to negotiate" },
      { title: "Instant Payment", subtitle: "and Moving", body: "Cash payment on the spot, and free moving with the right equipment" },
    ],
    faqTitle: "FAQ about Buying Used Sofas",
    faq: [
      { question: "Do you buy all types of sofas?", answer: "Yes, we buy American, Turkish, and local seating sets, in leather or fabric, of every size." },
      { question: "How do you price a used sofa?", answer: "Based on the fabric or leather type, cushioning condition, frame durability, and size." },
      { question: "Do you buy a sofa that needs reupholstering?", answer: "Yes, we buy sofas that need reupholstering or minor repairs, with the price varying by condition." },
      { question: "Is moving free?", answer: "Yes, our team moves large sofas at no extra cost to you." },
    ],
    otherServicesTitle: "Other Services",
    otherServices: [
      { label: "Used Home Furniture", href: "/buy-used-home-furniture" as const },
      { label: "Used Bedrooms", href: "/buy-used-bedrooms" as const },
      { label: "Used Appliances", href: "/buy-used-appliances" as const },
      { label: "Full House Clearance", href: "/house-clearance" as const },
      { label: "Antiques & Artifacts", href: "/buy-antiques" as const },
      { label: "Used Kitchens", href: "/buy-used-kitchens" as const },
    ],
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Want to sell your sofa? Get the best price now",
    callCta: "Call Us Now",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/buy-used-sofas">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/buy-used-sofas",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/service/aldabouqi7.webp`,
  });
}

export default async function BuyUsedSofasPage({ params }: PageProps<"/[locale]/buy-used-sofas">) {
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
          { name: c.pageTitle, path: "/buy-used-sofas" },
        ]}
      />
      <FaqJsonLd items={c.faq} />
      <HowToJsonLd
        name={locale === "en" ? "How to sell your used sofa to Aldabouqi" : "كيف تبيع صالونك المستعمل للدابوقي"}
        description={locale === "en" ? "Simple steps to sell your used sofa for the best price" : "خطوات بسيطة لبيع صالونك المستعمل بأفضل سعر"}
        steps={c.steps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={c.pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: "/buy-used-sofas", label: c.pageTitle },
        ]}
        heroImage={{ src: "/img/service/aldabouqi7.webp", alt: c.heroImageAlt }}
        introTitle={c.introTitle}
        introBody={c.introBody}
        introImage={{ src: "/img/service/aldabouqi2.webp", alt: c.introImageAlt }}
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
