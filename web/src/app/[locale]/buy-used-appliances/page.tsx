import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شراء أجهزة كهربائية مستعملة في عمان | الدابوقي",
    metaDescription:
      "نشتري الأجهزة الكهربائية المستعملة في عمان: ثلاجات، غسالات، مكيفات، تلفزيونات، أفران. معاينة مجانية، تقييم فوري، دفع نقدي. اتصل: 0796983994",
    keywords:
      "شراء اجهزة كهربائية مستعملة عمان, بيع ثلاجة مستعملة, بيع غسالة مستعملة, شراء مكيفات مستعملة, بيع تلفزيون مستعمل, شراء الكترونيات مستعملة عمان, محلات شراء اجهزة كهربائية",
    pageTitle: "شراء أجهزة كهربائية مستعملة",
    breadcrumbServices: "خدماتنا",
    serviceType: "شراء أجهزة كهربائية مستعملة",
    serviceName: "خدمة شراء الأجهزة الكهربائية المستعملة في عمان",
    serviceDescription:
      "نشتري كافة الأجهزة الكهربائية المستعملة: ثلاجات، غسالات، مكيفات، تلفزيونات، أفران وجميع الإلكترونيات المنزلية، بمعاينة فورية وتقييم عادل لحالة الجهاز وكفاءته.",
    offerDescription: "معاينة مجانية وتقييم احترافي للأجهزة الكهربائية المستعملة",
    heroImageAlt: "أجهزة كهربائية مستعملة للبيع",
    introImageAlt: "شراء أجهزة كهربائية مستعملة عمان",
    introTitle: "شراء جميع أنواع الأجهزة الكهربائية المستعملة في عمان",
    introBody:
      "نشتري الأجهزة الكهربائية المستعملة بمختلف أنواعها وأعمارها: ثلاجات، غسالات، مكيفات، تلفزيونات، أفران، وجميع الأجهزة المنزلية والمطبخية. نفحص كفاءة الجهاز وحالته الفعلية قبل تقديم سعر عادل، سواء كان الجهاز يعمل بكامل طاقته أو يحتاج صيانة بسيطة.",
    bullets: [
      "نشتري ثلاجات، غسالات، مكيفات، وأفران بجميع الماركات والأحجام",
      "نشتري تلفزيونات وأجهزة إلكترونية منزلية بأسعار عادلة",
      "نشتري الأجهزة التي تحتاج صيانة بسيطة — تقييم منصف لكل حالة",
      "معاينة مجانية فورية، دفع نقدي، ونقل بدون أي تكلفة",
    ],
    features: [
      { title: "فحص فني دقيق", body: "نتأكد من كفاءة كل جهاز قبل تقديم السعر، بمعايير واضحة وشفافة" },
      { title: "أسعار عادلة", body: "نقيّم الجهاز حسب عمره وحالته وكفاءته الفعلية، بدون مفاجآت" },
      { title: "نقل آمن ومجاني", body: "فريقنا يتولى فك ونقل الأجهزة الكبيرة بدون أي تكلفة إضافية" },
    ],
    howToTitle: "كيف تبيع جهازك الكهربائي المستعمل؟",
    howToIntro: "عملية بسيطة وسريعة من أول اتصال لحد استلام الكاش.",
    steps: [
      { title: "اتصل بنا أو", subtitle: "أرسل صور الجهاز", body: "أرسل لنا صوراً واضحة للجهاز مع ذكر الماركة والعمر التقريبي عبر الواتساب" },
      { title: "معاينة مجانية", subtitle: "وفحص الكفاءة", body: "يزورك فني متخصص لفحص الجهاز والتأكد من كفاءته التشغيلية" },
      { title: "عرض السعر", subtitle: "والتفاوض", body: "نقدم سعراً عادلاً بناءً على حالة الجهاز، مع إمكانية التفاوض" },
      { title: "الدفع الفوري", subtitle: "والنقل", body: "دفع نقدي مباشر، ونقل الجهاز مجاناً بمعدات مناسبة" },
    ],
    faqTitle: "الأسئلة الشائعة حول شراء الأجهزة الكهربائية المستعملة",
    faq: [
      { question: "هل تشترون الأجهزة التي لا تعمل؟", answer: "نشتري الأجهزة التي تحتاج صيانة بسيطة بسعر يعكس حالتها، لكن الأجهزة المعطلة بالكامل قد لا نتمكن من شرائها — اسألنا مباشرة على واتساب لتقييم حالتك." },
      { question: "ما هي الأجهزة التي تشترونها؟", answer: "ثلاجات، غسالات، مكيفات، تلفزيونات، أفران، مايكرويف، وجميع الأجهزة الكهربائية المنزلية الأخرى." },
      { question: "كيف تحددون سعر الجهاز؟", answer: "حسب الماركة، العمر، الكفاءة التشغيلية، والحالة الخارجية للجهاز." },
      { question: "هل النقل مجاني؟", answer: "نعم، فريقنا يتولى فك ونقل الأجهزة الكبيرة كالمكيفات والثلاجات بدون أي تكلفة إضافية." },
    ],
    otherServicesTitle: "خدمات أخرى",
    otherServices: [
      { label: "شراء أثاث منزلي مستعمل", href: "/buy-used-home-furniture" as const },
      { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
      { label: "إفراغ منازل بالكامل", href: "/house-clearance" as const },
      { label: "شراء أنتيكات وتحف", href: "/buy-antiques" as const },
      { label: "شراء صالونات مستعملة", href: "/buy-used-sofas" as const },
      { label: "شراء مطابخ مستعملة", href: "/buy-used-kitchens" as const },
    ],
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "بدك تبيع جهازك الكهربائي؟ احصل على سعر عادل الآن",
    callCta: "اتصل بنا الآن",
  },
  en: {
    metaTitle: "Used Appliances in Amman | Aldabouqi",
    metaDescription:
      "We buy used appliances in Amman: fridges, washing machines, AC units, TVs, ovens. Free inspection, instant valuation, cash payment. Call: 0796983994",
    keywords:
      "used appliances Amman, sell used fridge, sell used washing machine, buy used AC units, sell used TV, buy used electronics Amman",
    pageTitle: "Used Appliances",
    breadcrumbServices: "Services",
    serviceType: "Used Appliances Buying",
    serviceName: "Used Appliances Buying Service in Amman",
    serviceDescription:
      "We buy all used appliances: refrigerators, washing machines, air conditioners, TVs, ovens, and every home electronic device, with an instant inspection and a fair valuation of the unit's condition and efficiency.",
    offerDescription: "Free inspection and professional valuation of used appliances",
    heroImageAlt: "Used appliances for sale",
    introImageAlt: "Used Appliances Amman",
    introTitle: "Buying All Types of Used Appliances in Amman",
    introBody:
      "We buy used appliances of every kind and age: refrigerators, washing machines, air conditioners, TVs, ovens, and every home and kitchen appliance. We check the unit's efficiency and actual condition before offering a fair price, whether it runs at full capacity or needs minor servicing.",
    bullets: [
      "We buy fridges, washing machines, AC units, and ovens of every brand and size",
      "We buy TVs and home electronics at fair prices",
      "We buy appliances that need minor servicing — a fair valuation for every condition",
      "Instant free inspection, cash payment, and free moving",
    ],
    features: [
      { title: "Careful Technical Check", body: "We verify every unit's efficiency before quoting a price, with clear, transparent standards" },
      { title: "Fair Prices", body: "We value the unit based on its age, condition, and actual efficiency — no surprises" },
      { title: "Safe, Free Moving", body: "Our team disassembles and moves large appliances at no extra cost" },
    ],
    howToTitle: "How to sell your used appliance?",
    howToIntro: "A simple, fast process from the first call to cash in hand.",
    steps: [
      { title: "Call us or", subtitle: "Send Photos", body: "Send us clear photos of the appliance with the brand and approximate age via WhatsApp" },
      { title: "Free Inspection", subtitle: "and Efficiency Check", body: "A technician visits you to check the appliance's operating efficiency" },
      { title: "Price Offer", subtitle: "and Negotiation", body: "We offer a fair price based on the unit's condition, with room to negotiate" },
      { title: "Instant Payment", subtitle: "and Moving", body: "Cash payment on the spot, and free moving with the right equipment" },
    ],
    faqTitle: "FAQ about Used Appliances",
    faq: [
      { question: "Do you buy appliances that don't work?", answer: "We buy appliances that need minor servicing at a price reflecting their condition, but fully broken units may not be purchasable — ask us directly on WhatsApp to assess your case." },
      { question: "What appliances do you buy?", answer: "Refrigerators, washing machines, air conditioners, TVs, ovens, microwaves, and every other home appliance." },
      { question: "How do you price an appliance?", answer: "Based on brand, age, operating efficiency, and external condition." },
      { question: "Is moving free?", answer: "Yes, our team disassembles and moves large appliances like AC units and refrigerators at no extra cost." },
    ],
    otherServicesTitle: "Other Services",
    otherServices: [
      { label: "Used Home Furniture", href: "/buy-used-home-furniture" as const },
      { label: "Used Bedrooms", href: "/buy-used-bedrooms" as const },
      { label: "Full House Clearance", href: "/house-clearance" as const },
      { label: "Antiques & Artifacts", href: "/buy-antiques" as const },
      { label: "Used Sofas", href: "/buy-used-sofas" as const },
      { label: "Used Kitchens", href: "/buy-used-kitchens" as const },
    ],
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Want to sell your appliance? Get a fair price now",
    callCta: "Call Us Now",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/buy-used-appliances">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/buy-used-appliances",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/service/aldabouqi4.webp`,
  });
}

export default async function BuyUsedAppliancesPage({ params }: PageProps<"/[locale]/buy-used-appliances">) {
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
          { name: c.pageTitle, path: "/buy-used-appliances" },
        ]}
      />
      <FaqJsonLd items={c.faq} />
      <HowToJsonLd
        name={locale === "en" ? "How to sell your used appliance to Aldabouqi" : "كيف تبيع جهازك الكهربائي المستعمل للدابوقي"}
        description={locale === "en" ? "Simple steps to sell your used appliance for a fair price" : "خطوات بسيطة لبيع جهازك الكهربائي المستعمل بسعر عادل"}
        steps={c.steps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={c.pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: "/buy-used-appliances", label: c.pageTitle },
        ]}
        heroImage={{ src: "/img/service/aldabouqi4.webp", alt: c.heroImageAlt }}
        introTitle={c.introTitle}
        introBody={c.introBody}
        introImage={{ src: "/img/service/aldabouqi3.webp", alt: c.introImageAlt }}
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
