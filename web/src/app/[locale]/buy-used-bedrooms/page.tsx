import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شراء غرف نوم مستعملة في عمان | أفضل الأسعار - خشب، MDF، تركي | الدابوقي",
    metaDescription:
      "نشتري غرف نوم مستعملة بجميع أنواعها في عمان: خشب، MDF، تركي، صيني بأعلى الأسعار. معاينة مجانية فورية، تقييم احترافي، دفع نقدي. اتصل: 0796983994",
    keywords:
      "شراء غرف نوم مستعملة عمان, بيع غرف نوم مستعملة, شراء غرف نوم خشب, غرف نوم تركي للبيع, غرف نوم MDF مستعملة, شراء اثاث غرف نوم, محلات شراء غرف نوم عمان, غرف نوم صيني مستعملة, الدابوقي غرف نوم",
    pageTitle: "شراء غرف نوم مستعملة",
    breadcrumbServices: "خدماتنا",
    serviceType: "شراء غرف نوم مستعملة",
    serviceName: "خدمة شراء غرف النوم المستعملة في عمان",
    serviceDescription:
      "نشتري جميع أنواع غرف النوم المستعملة: غرف نوم خشب طبيعي، MDF، تركي، صيني، إيطالي. نقدم أفضل الأسعار في السوق الأردني مع معاينة مجانية فورية وتقييم احترافي دقيق لحالة الغرفة وجودة الخشب والتصنيع",
    offerDescription: "معاينة مجانية وتقييم احترافي لغرف النوم المستعملة",
    introTitle: "شراء جميع أنواع غرف النوم المستعملة في عمان بأعلى الأسعار",
    introBody:
      "نحن في شركة الدابوقي متخصصون في شراء غرف النوم المستعملة بجميع أنواعها وأشكالها. مع خبرة تمتد لأكثر من 60 عاماً في السوق الأردني، أصبحنا الخيار الأول لآلاف العائلات التي ترغب ببيع غرف نومها بطريقة سريعة وآمنة ومربحة. نشتري جميع أنواع غرف النوم بغض النظر عن نوع الخشب أو بلد المنشأ: غرف نوم خشب طبيعي (زان، سنديان، جوز)، غرف نوم MDF بجميع أنواعه، غرف نوم تركي الصنع، صيني، إيطالي، ألماني ومحلي.",
    bullets: [
      "نشتري غرف النوم الخشب الطبيعي (زان، سنديان، جوز) بأعلى الأسعار في الأردن",
      "شراء غرف نوم MDF، تركي، صيني، إيطالي بأسعار تنافسية ومنصفة جداً",
      "نشتري غرف النوم الناقصة أو المكسورة - تقييم عادل لكل حالة",
      "معاينة مجانية فورية، دفع نقدي، فك ونقل مجاني - خدمة متكاملة",
    ],
    features: [
      { title: "خبرة 60+ عاماً", body: "خبرة طويلة في تقييم غرف النوم بمختلف أنواعها وأشكالها - نعرف قيمة كل خشب وكل تفصيلة" },
      { title: "تقييم دقيق ومنصف", body: "نفحص كل تفصيلة: نوع الخشب، جودة التصنيع، حالة الدهان، اكتمال القطع - ونقدم سعراً عادلاً" },
      { title: "خدمة فك ونقل مجانية", body: "فريقنا المحترف يتولى فك الغرفة بطريقة آمنة ونقلها بدون أي تكلفة إضافية عليك" },
    ],
    howToTitle: "كيف تبيع غرفة نومك المستعملة؟",
    howToIntro:
      "عملية بيع غرفة النوم لدينا بسيطة وسريعة جداً، مصممة لتضمن لك راحة البال والحصول على أفضل سعر.",
    steps: [
      { title: "اتصل بنا أو", subtitle: "أرسل صور الغرفة", body: "اتصل على رقمنا 0796983994 أو أرسل لنا صوراً واضحة لغرفة النوم من جميع الزوايا عبر الواتساب" },
      { title: "معاينة مجانية", subtitle: "وفحص دقيق", body: "يزورك خبير متخصص في غرف النوم لمعاينة الغرفة بشكل دقيق. نفحص نوع الخشب، حالة الدهان، وجودة التصنيع" },
      { title: "عرض السعر", subtitle: "والتفاوض", body: "نقدم لك سعراً عادلاً بناءً على التقييم الدقيق للغرفة، مع إمكانية التفاوض للوصول لسعر يرضي الطرفين" },
      { title: "الدفع الفوري", subtitle: "والفك والنقل", body: "بعد الاتفاق نقوم بالدفع نقداً مباشرة. فريقنا المحترف يتولى فك الغرفة ونقلها بمعدات مناسبة مجاناً" },
    ],
    faqTitle: "الأسئلة الشائعة حول شراء غرف النوم المستعملة",
    faq: [
      { question: "هل تشترون جميع أنواع غرف النوم المستعملة؟", answer: "نعم، نشتري جميع أنواع غرف النوم المستعملة بغض النظر عن نوع الخشب أو بلد المنشأ: خشب طبيعي، MDF، تركي، صيني، إيطالي، ألماني." },
      { question: "كيف يتم تحديد سعر غرفة النوم المستعملة؟", answer: "نحدد السعر بناءً على نوع الخشب، حالة الغرفة، جودة التصنيع والدهان، بلد المنشأ، اكتمال القطع، ووجود أضرار أو خدوش." },
      { question: "هل تشترون غرف النوم غير المكتملة أو المكسورة؟", answer: "نعم، نشتري غرف النوم حتى لو كانت غير مكتملة أو فيها قطع مكسورة، مع اختلاف السعر حسب حالة الغرفة." },
      { question: "كم يستغرق فك ونقل غرفة النوم؟", answer: "عملية الفك والنقل عادة تستغرق من ساعة إلى ساعتين حسب حجم الغرفة وموقعها، وكل هذا مجاناً." },
      { question: "هل السعر قابل للتفاوض؟", answer: "نعم، نحن دائماً منفتحون على التفاوض للوصول لسعر عادل يرضي الطرفين." },
    ],
    otherServicesTitle: "خدمات أخرى",
    otherServices: [
      { label: "شراء أثاث منزلي مستعمل", href: "/buy-used-home-furniture" as const },
      { label: "شراء أثاث مكتبي مستعمل", href: "/buy-used-office-furniture" as const },
      { label: "شراء أجهزة كهربائية مستعملة" },
      { label: "إفراغ منازل بالكامل" },
      { label: "شراء أنتيكات وتحف" },
      { label: "شراء مطابخ مستعملة" },
    ],
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "احصل على أفضل سعر لغرفتك الآن",
    callCta: "اتصل بنا الآن",
  },
  en: {
    metaTitle: "Used Bedrooms in Amman | Best Prices - Wood, MDF, Turkish | Aldabouqi",
    metaDescription:
      "We buy used bedrooms of every kind in Amman: wood, MDF, Turkish, Chinese, at the best prices. Instant free inspection, professional valuation, cash payment. Call: 0796983994",
    keywords:
      "used bedrooms Amman, sell used bedrooms, buy wooden bedrooms, Turkish bedrooms for sale, used MDF bedrooms, buy bedroom furniture, bedroom buying shops Amman, used Chinese bedrooms, Aldabouqi bedrooms",
    pageTitle: "Used Bedrooms",
    breadcrumbServices: "Services",
    serviceType: "Used Bedrooms Buying",
    serviceName: "Used Bedrooms Buying Service in Amman",
    serviceDescription:
      "We buy all types of used bedrooms: solid wood, MDF, Turkish, Chinese, Italian. We offer the best prices in the Jordanian market with an instant free inspection and accurate professional valuation of the room's condition and craftsmanship quality",
    offerDescription: "Free inspection and professional valuation of used bedrooms",
    introTitle: "Buying All Types of Used Bedrooms in Amman at the Best Prices",
    introBody:
      "At Aldabouqi we specialize in used bedrooms of every kind and style. With over 60 years of experience in the Jordanian market, we've become the first choice for thousands of families looking to sell their bedroom quickly, safely, and profitably. We buy all types of bedrooms regardless of wood type or country of origin: solid wood (beech, oak, walnut), all kinds of MDF, Turkish-made, Chinese, Italian, German and local.",
    bullets: [
      "We buy solid-wood bedrooms (beech, oak, walnut) at the best prices in Jordan",
      "Buying MDF, Turkish, Chinese, and Italian bedrooms at very competitive, fair prices",
      "We buy incomplete or damaged bedrooms - a fair valuation for every condition",
      "Instant free inspection, cash payment, free disassembly & moving - complete service",
    ],
    features: [
      { title: "60+ Years of Experience", body: "Years of experience valuing bedrooms of every kind and style — we know the value of every wood type and every detail" },
      { title: "Accurate, Fair Valuation", body: "We check every detail: wood type, craftsmanship quality, finish condition, whether pieces are complete — and offer a fair price" },
      { title: "Free Disassembly & Moving Service", body: "Our professional team safely disassembles and moves the room with no extra cost to you" },
    ],
    howToTitle: "How to sell your used bedroom?",
    howToIntro:
      "Our bedroom-buying process is simple and very fast, designed to guarantee peace of mind and the best price.",
    steps: [
      { title: "Call us or", subtitle: "Send Room Photos", body: "Call us at 0796983994 or send us clear photos of the bedroom from every angle via WhatsApp" },
      { title: "Free Inspection", subtitle: "and Accurate Inspection", body: "A bedroom specialist visits you for a careful inspection — wood type, finish condition, craftsmanship quality" },
      { title: "Price Offer", subtitle: "and Negotiation", body: "We offer you a fair price based on the room's accurate valuation, with room to negotiate a price that satisfies both sides" },
      { title: "Instant Payment", subtitle: "and Disassembly & Moving", body: "Once we agree, we pay cash immediately. Our team safely disassembles and moves the room, for free" },
    ],
    faqTitle: "FAQ about Used Bedrooms",
    faq: [
      { question: "Do you buy all types of used bedrooms?", answer: "Yes, we buy all types of used bedrooms regardless of wood type or country of origin: solid wood, MDF, Turkish, Chinese, Italian, German." },
      { question: "How is the price of a used bedroom determined?", answer: "We set the price based on wood type, the room's condition, craftsmanship and finish quality, country of origin, and whether all pieces are complete." },
      { question: "Do you buy incomplete or damaged bedrooms?", answer: "Yes, we buy bedrooms even if they're incomplete or have broken pieces; the price will vary depending on condition." },
      { question: "How long does disassembly and moving take?", answer: "Usually one to two hours depending on the room's size and location, all handled by us for free." },
      { question: "Is the price negotiable?", answer: "Yes, we're always open to negotiation to reach a fair price that satisfies both sides." },
    ],
    otherServicesTitle: "Other Services",
    otherServices: [
      { label: "Used Home Furniture", href: "/buy-used-home-furniture" as const },
      { label: "Used Office Furniture", href: "/buy-used-office-furniture" as const },
      { label: "Used Appliances" },
      { label: "Full House Clearance" },
      { label: "Antiques & Artifacts" },
      { label: "Used Kitchens" },
    ],
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Get the best price for your room now",
    callCta: "Call Us Now",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/buy-used-bedrooms">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/buy-used-bedrooms",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/service/bedrooms-used.jpg`,
  });
}

export default async function BuyUsedBedroomsPage({ params }: PageProps<"/[locale]/buy-used-bedrooms">) {
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
          { name: c.pageTitle, path: "/buy-used-bedrooms" },
        ]}
      />
      <FaqJsonLd items={c.faq} />
      <HowToJsonLd
        name={locale === "en" ? "How to sell your used bedroom to Aldabouqi" : "كيف تبيع غرفة نومك المستعملة للدابوقي"}
        description={locale === "en" ? "Simple steps to sell your used bedroom for the best price" : "خطوات بسيطة لبيع غرفة نومك المستعملة بأفضل سعر"}
        steps={c.steps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={c.pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: "/buy-used-bedrooms", label: c.pageTitle },
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
