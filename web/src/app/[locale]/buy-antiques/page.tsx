import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شراء أنتيكات وتحف مستعملة في عمان | تقييم دقيق - الدابوقي",
    metaDescription:
      "نشتري الأنتيكات والتحف القديمة في عمان: مشغولات تراثية، لوحات فنية، وقطع نادرة. تقييم دقيق واحترافي ودفع نقدي فوري. اتصل: 0796983994",
    keywords:
      "شراء انتيكات عمان, بيع تحف قديمة, شراء قطع اثرية, بيع مقتنيات تراثية, محلات شراء انتيكات الاردن, تقييم انتيكات",
    pageTitle: "شراء أنتيكات وتحف",
    breadcrumbServices: "خدماتنا",
    serviceType: "شراء أنتيكات وتحف",
    serviceName: "خدمة شراء الأنتيكات والتحف في عمان",
    serviceDescription:
      "نشتري القطع النادرة والأنتيكات: تحف قديمة، لوحات فنية، مشغولات تراثية، وجميع المقتنيات الثمينة، بتقييم دقيق يراعي القيمة التاريخية والفنية لكل قطعة.",
    offerDescription: "تقييم دقيق ومتخصص للأنتيكات والتحف مع دفع نقدي فوري",
    heroImageAlt: "أنتيكات وتحف قديمة للبيع",
    introImageAlt: "شراء أنتيكات وتحف عمان",
    introTitle: "شراء الأنتيكات والتحف النادرة بتقييم دقيق",
    introBody:
      "نشتري القطع النادرة والأنتيكات بمختلف أنواعها: تحف قديمة، لوحات فنية، مشغولات تراثية، أثاث عتيق، وكل ما له قيمة تاريخية أو فنية. نتعامل مع كل قطعة بعناية ونقيّمها بناءً على عمرها، ندرتها، وحالتها الفعلية.",
    bullets: [
      "نشتري التحف القديمة والقطع الأثرية بتقييم متخصص",
      "نشتري اللوحات الفنية والمشغولات التراثية",
      "نشتري الأثاث العتيق والقطع النادرة",
      "تقييم دقيق يراعي القيمة التاريخية والفنية، ودفع نقدي فوري",
    ],
    features: [
      { title: "تقييم متخصص", body: "نراعي القيمة التاريخية والفنية لكل قطعة، مو بس عمرها" },
      { title: "تعامل بعناية", body: "نتعامل مع القطع الحساسة والنادرة بأقصى درجات الحرص أثناء المعاينة والنقل" },
      { title: "سرية تامة", body: "نحترم خصوصية مقتنياتك ونتعامل بسرية كاملة مع كل صفقة" },
    ],
    howToTitle: "كيف تبيع أنتيكاتك وتحفك؟",
    howToIntro: "عملية تراعي حساسية القطع النادرة من أول تواصل.",
    steps: [
      { title: "اتصل بنا أو", subtitle: "أرسل صور القطعة", body: "أرسل لنا صوراً واضحة للقطعة مع أي معلومات عن تاريخها أو مصدرها" },
      { title: "معاينة متخصصة", subtitle: "وتقييم دقيق", body: "يزورك خبير لمعاينة القطعة عن قرب وتقييم قيمتها التاريخية والفنية" },
      { title: "عرض سعر عادل", subtitle: "والتفاوض", body: "نقدم سعراً يعكس القيمة الحقيقية للقطعة، مع إمكانية التفاوض" },
      { title: "الدفع الفوري", subtitle: "ونقل آمن", body: "دفع نقدي مباشر، ونقل القطعة بعناية فائقة تحافظ على سلامتها" },
    ],
    faqTitle: "الأسئلة الشائعة حول شراء الأنتيكات",
    faq: [
      { question: "ما نوع الأنتيكات التي تشترونها؟", answer: "تحف قديمة، لوحات فنية، مشغولات تراثية، أثاث عتيق، وأي قطعة نادرة ذات قيمة تاريخية أو فنية." },
      { question: "كيف تحددون قيمة القطعة الأثرية؟", answer: "نراعي عمر القطعة، ندرتها، حالتها، ومصدرها إن وجد — بتقييم متخصص لكل قطعة على حدة." },
      { question: "هل تشترون قطعة واحدة فقط؟", answer: "نعم، نشتري قطعة واحدة كما نشتري مجموعة كاملة من الأنتيكات." },
      { question: "هل التعامل سري؟", answer: "نعم، نحترم خصوصية عملائنا بالكامل في كل صفقة تخص المقتنيات النادرة." },
    ],
    otherServicesTitle: "خدمات أخرى",
    otherServices: [
      { label: "شراء أثاث منزلي مستعمل", href: "/buy-used-home-furniture" as const },
      { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
      { label: "شراء أجهزة كهربائية مستعملة", href: "/buy-used-appliances" as const },
      { label: "إفراغ منازل بالكامل", href: "/house-clearance" as const },
      { label: "شراء صالونات مستعملة", href: "/buy-used-sofas" as const },
      { label: "شراء مطابخ مستعملة", href: "/buy-used-kitchens" as const },
    ],
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "عندك قطعة نادرة أو أنتيكة؟ احصل على تقييم دقيق الآن",
    callCta: "اتصل بنا الآن",
  },
  en: {
    metaTitle: "Buy Antiques & Artifacts in Amman | Aldabouqi",
    metaDescription:
      "We buy antiques and old artifacts in Amman: heritage crafts, paintings, rare pieces. Accurate valuation, instant cash payment. Call: 0796983994",
    keywords:
      "buy antiques Amman, sell old artifacts, buy antique pieces, sell heritage items Jordan, antique buying shops Amman, antique valuation",
    pageTitle: "Antiques & Artifacts",
    breadcrumbServices: "Services",
    serviceType: "Antiques & Artifacts Buying",
    serviceName: "Antiques & Artifacts Buying Service in Amman",
    serviceDescription:
      "We buy rare pieces and antiques: old artifacts, paintings, heritage crafts, and all valuables, with an accurate valuation that accounts for each piece's historical and artistic value.",
    offerDescription: "An accurate, specialized valuation of antiques and artifacts, with instant cash payment",
    heroImageAlt: "Antiques and old artifacts for sale",
    introImageAlt: "Buying Antiques Amman",
    introTitle: "Buying Rare Antiques and Artifacts with an Accurate Valuation",
    introBody:
      "We buy rare pieces and antiques of every kind: old artifacts, paintings, heritage crafts, antique furniture, and anything of historical or artistic value. We handle each piece with care and value it based on its age, rarity, and actual condition.",
    bullets: [
      "We buy old artifacts and antique pieces with a specialized valuation",
      "We buy paintings and heritage crafts",
      "We buy antique furniture and rare pieces",
      "An accurate valuation accounting for historical and artistic value, with instant cash payment",
    ],
    features: [
      { title: "Specialized Valuation", body: "We account for each piece's historical and artistic value, not just its age" },
      { title: "Careful Handling", body: "We handle delicate, rare pieces with the utmost care during inspection and moving" },
      { title: "Complete Discretion", body: "We respect the privacy of your belongings and handle every deal with full confidentiality" },
    ],
    howToTitle: "How to sell your antiques and artifacts?",
    howToIntro: "A process that respects the sensitivity of rare pieces from the first contact.",
    steps: [
      { title: "Call us or", subtitle: "Send Photos", body: "Send us clear photos of the piece along with any information about its history or origin" },
      { title: "Specialized Inspection", subtitle: "and Accurate Valuation", body: "An expert visits to closely inspect the piece and assess its historical and artistic value" },
      { title: "Fair Price Offer", subtitle: "and Negotiation", body: "We offer a price reflecting the piece's true value, with room to negotiate" },
      { title: "Instant Payment", subtitle: "and Safe Moving", body: "Cash payment on the spot, and the piece is moved with the utmost care to preserve its condition" },
    ],
    faqTitle: "FAQ about Buying Antiques",
    faq: [
      { question: "What kind of antiques do you buy?", answer: "Old artifacts, paintings, heritage crafts, antique furniture, and any rare piece of historical or artistic value." },
      { question: "How do you determine an artifact's value?", answer: "We account for the piece's age, rarity, condition, and provenance if known — a specialized valuation for each piece individually." },
      { question: "Do you buy a single piece only?", answer: "Yes, we buy a single piece just as we buy a full antique collection." },
      { question: "Is the deal confidential?", answer: "Yes, we fully respect our clients' privacy in every deal involving rare belongings." },
    ],
    otherServicesTitle: "Other Services",
    otherServices: [
      { label: "Used Home Furniture", href: "/buy-used-home-furniture" as const },
      { label: "Used Bedrooms", href: "/buy-used-bedrooms" as const },
      { label: "Used Appliances", href: "/buy-used-appliances" as const },
      { label: "Full House Clearance", href: "/house-clearance" as const },
      { label: "Used Sofas", href: "/buy-used-sofas" as const },
      { label: "Used Kitchens", href: "/buy-used-kitchens" as const },
    ],
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Have a rare piece or antique? Get an accurate valuation now",
    callCta: "Call Us Now",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/buy-antiques">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/buy-antiques",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/service/aldabouqi6.webp`,
  });
}

export default async function BuyAntiquesPage({ params }: PageProps<"/[locale]/buy-antiques">) {
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
          { name: c.pageTitle, path: "/buy-antiques" },
        ]}
      />
      <FaqJsonLd items={c.faq} />
      <HowToJsonLd
        name={locale === "en" ? "How to sell your antiques to Aldabouqi" : "كيف تبيع أنتيكاتك للدابوقي"}
        description={locale === "en" ? "Simple steps to sell your antiques and artifacts" : "خطوات بسيطة لبيع أنتيكاتك وتحفك"}
        steps={c.steps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={c.pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: "/buy-antiques", label: c.pageTitle },
        ]}
        heroImage={{ src: "/img/service/aldabouqi6.webp", alt: c.heroImageAlt }}
        introTitle={c.introTitle}
        introBody={c.introBody}
        introImage={{ src: "/img/service/aldabouqi7.webp", alt: c.introImageAlt }}
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
