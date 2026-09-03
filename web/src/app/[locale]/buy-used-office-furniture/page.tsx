import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شراء أثاث مكتبي مستعمل للبيع في عمان | مكاتب وكراسي - الدابوقي",
    metaDescription:
      "نشتري جميع أنواع الأثاث المكتبي المستعمل للبيع في عمان: مكاتب إدارية، كراسي، خزائن ملفات، طاولات اجتماعات. معاينة مجانية ودفع نقدي فوري. اتصل: 0796983994",
    keywords:
      "شراء أثاث مكتبي مستعمل عمان, بيع اثاث مكاتب, شراء مكاتب مستعملة, كراسي مكتبية للبيع, خزائن ملفات مستعملة, اثاث شركات للبيع, طاولات اجتماعات مستعملة, ريسبشن للبيع, الدابوقي, اثاث مكتبي عمان",
    pageTitle: "شراء أثاث مكتبي مستعمل",
    breadcrumbServices: "خدماتنا",
    serviceType: "شراء أثاث مكتبي مستعمل",
    serviceName: "خدمة شراء الأثاث المكتبي المستعمل في عمان",
    serviceDescription:
      "نشتري جميع أنواع الأثاث المكتبي المستعمل: مكاتب إدارية وتنفيذية، كراسي مكتبية بجميع أنواعها، خزائن ملفات، طاولات اجتماعات، ريسبشن، كاونترات، بارتيشن، أرفف، خزائن معدنية، وكل ما يتعلق بتجهيز المكاتب والشركات بأفضل الأسعار في السوق الأردني",
    offerDescription: "معاينة مجانية وتقييم احترافي للأثاث المكتبي المستعمل",
    introTitle: "شراء جميع أنواع الأثاث المكتبي المستعمل في عمان - مكاتب، كراسي، خزائن",
    introBody:
      "نحن في شركة الدابوقي متخصصون في شراء الأثاث المكتبي المستعمل بجميع أنواعه وأحجامه. مع خبرة تمتد لأكثر من 60 عاماً في السوق الأردني، نقدم أفضل الأسعار للشركات والمكاتب التي ترغب في بيع أثاثها المكتبي أو تجديد تجهيزاتها. نشتري جميع أنواع الأثاث المكتبي: مكاتب إدارية وتنفيذية، مكاتب موظفين، كراسي مكتبية، خزائن ملفات، طاولات اجتماعات، ريسبشن، كاونترات استقبال، بارتيشن، أرفف، خزائن معدنية، وحدات تخزين، وكل ما يتعلق بتجهيز المكاتب والشركات.",
    bullets: [
      "نشتري المكاتب الإدارية والتنفيذية بجميع الأحجام والماركات بأعلى الأسعار",
      "شراء الكراسي المكتبية، طاولات الاجتماعات، والريسبشن بأسعار منافسة",
      "نشتري البارتيشن، خزائن الملفات، الأرفف، وكل التجهيزات المكتبية",
      "خدمة كاملة للكميات الكبيرة - معاينة، دفع فوري، نقل مجاني",
    ],
    features: [
      { title: "متخصصون بالكميات الكبيرة", body: "نشتري تجهيزات الشركات الكاملة - من 10 مكاتب لـ 100+ مكتب. فريقنا وإمكانياتنا جاهزة" },
      { title: "تقييم دقيق واحترافي", body: "نعرف قيمة كل قطعة - مكاتب إدارية، كراسي طبية، بارتيشن، خزائن - تقييم عادل ومنصف" },
      { title: "سرعة في الإنجاز", body: "نفرغ المكاتب والشركات بسرعة مع فريق محترف ومعدات مناسبة - مجاناً" },
    ],
    howToTitle: "كيف تبيع أثاثك المكتبي؟",
    howToIntro:
      "عملية بيع الأثاث المكتبي لدينا مصممة خصيصاً لراحة أصحاب الشركات والمكاتب، ونوفر لك حلاً متكاملاً يوفر عليك الوقت والجهد.",
    steps: [
      { title: "اتصل بنا أو", subtitle: "أرسل صور الأثاث", body: "اتصل على رقمنا 0796983994 أو أرسل لنا صوراً للمكاتب، الكراسي، الخزائن، البارتيشن عبر الواتساب. أخبرنا بالكميات التقريبية" },
      { title: "زيارة ومعاينة", subtitle: "في موقع المكتب", body: "يزورك فريقنا المتخصص في موعد مناسب لك. نقوم بجرد كل القطع، معاينة حالة الأثاث، وتقييم دقيق لكل شيء" },
      { title: "عرض سعر شامل", subtitle: "للأثاث", body: "نقدم لك عرض سعر شامل لكل الأثاث المكتبي بناءً على التقييم. نحن منفتحون على التفاوض خاصة للكميات الكبيرة" },
      { title: "الدفع الفوري", subtitle: "والنقل المجاني", body: "بعد الاتفاق نقوم بالدفع نقداً مباشرة. فريقنا يتولى نقل كل الأثاث المكتبي من موقعك مجاناً بسرعة وكفاءة" },
    ],
    faqTitle: "الأسئلة الشائعة حول شراء الأثاث المكتبي المستعمل",
    faq: [
      { question: "هل تشترون أثاث المكاتب بكميات كبيرة؟", answer: "نعم، نحن متخصصون في شراء الأثاث المكتبي بكميات كبيرة، سواء مكتب واحد أو تجهيزات شركة كاملة بعشرات المكاتب والكراسي." },
      { question: "كيف يتم تقييم الأثاث المكتبي المستعمل؟", answer: "نقيّم الأثاث المكتبي بناءً على نوع المادة، الماركة إن وجدت، الحالة العامة، جودة التصنيع، عمر القطع، ومدى الطلب عليها في السوق." },
      { question: "هل تشترون الأثاث المكتبي التالف أو المكسور؟", answer: "نعم، نشتري الأثاث المكتبي حتى لو كان فيه أضرار أو قطع مكسورة، مع تأثر السعر حسب نوع وحجم الضرر." },
      { question: "كم يستغرق إفراغ مكتب كامل أو شركة؟", answer: "مكتب صغير قد يستغرق 2-4 ساعات، وشركة متوسطة قد تحتاج يوم عمل كامل، وشركة كبيرة قد تحتاج يومين أو أكثر." },
      { question: "هل تشترون البارتيشن والديكورات المكتبية؟", answer: "نعم، نشتري البارتيشن بجميع أنواعه: خشبي، ألمنيوم، زجاج، MDF، بالإضافة للديكورات المكتبية كالأرفف والخزائن المعدنية." },
    ],
    otherServicesTitle: "خدمات أخرى",
    otherServices: [
      { label: "شراء أثاث منزلي مستعمل", href: "/buy-used-home-furniture" as const },
      { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
      { label: "شراء أجهزة كهربائية مستعملة" },
      { label: "إفراغ منازل بالكامل" },
      { label: "شراء أنتيكات وتحف" },
      { label: "شراء مطابخ مستعملة" },
    ],
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "احصل على أفضل سعر لأثاثك المكتبي",
    callCta: "اتصل بنا الآن",
  },
  en: {
    metaTitle: "Used Office Furniture in Amman | Desks, Chairs, Cabinets | Aldabouqi",
    metaDescription:
      "We buy all types of used office furniture in Amman: executive desks, chairs, filing cabinets, meeting tables. Free inspection and instant cash payment. Call: 0796983994",
    keywords:
      "used office furniture Amman, desks for sale, office chairs, filing cabinets, office partitions, reception desks for sale, Aldabouqi, company furniture",
    pageTitle: "Used Office Furniture",
    breadcrumbServices: "Services",
    serviceType: "Used Office Furniture Buying",
    serviceName: "Used Office Furniture Buying Service in Amman",
    serviceDescription:
      "We buy all types of office furniture: executive and staff desks, office chairs, filing cabinets, meeting tables, reception desks, counters, partitions, shelving, metal cabinets, and everything related to office fit-outs at the best prices in the Jordanian market",
    offerDescription: "Free inspection and professional valuation of used office furniture",
    introTitle: "Buying All Types of Used Office Furniture in Amman - Desks, Chairs, Cabinets",
    introBody:
      "At Aldabouqi we specialize in buying used office furniture of every kind and size. With over 60 years of experience in the Jordanian market, we offer the best prices for companies and offices looking to sell their furniture or refresh their fit-out. We buy all types of office furniture: executive and staff desks, office chairs, filing cabinets, meeting tables, reception desks, counters, partitions, shelving, metal cabinets, storage units, and everything related to office fit-outs.",
    bullets: [
      "We buy executive and administrative desks of every size and brand at the best prices",
      "Buying office chairs, meeting tables, and reception desks at competitive prices",
      "We buy partitions, filing cabinets, shelving, and all office fit-out items",
      "A complete service for bulk quantities - inspection, instant payment, free moving",
    ],
    features: [
      { title: "Specialists in Bulk Quantities", body: "We buy complete company fit-outs - from 10 desks to 100+ desks. Our team and capacity are ready" },
      { title: "Accurate, Professional Valuation", body: "We know the value of every piece - executive desks, ergonomic chairs, partitions, cabinets - a fair, accurate valuation" },
      { title: "Fast Turnaround", body: "We clear offices and companies quickly with a professional team and proper equipment - for free" },
    ],
    howToTitle: "How to sell your office furniture?",
    howToIntro:
      "Our office-furniture buying process is designed specifically for the convenience of business and office owners, saving you time and effort.",
    steps: [
      { title: "Call us or", subtitle: "Send Furniture Photos", body: "Call us at 0796983994 or send photos of the desks, chairs, cabinets, and partitions via WhatsApp. Let us know the approximate quantities" },
      { title: "Visit & Inspection", subtitle: "at the office location", body: "Our specialist team visits at a time that suits you. We catalog every piece and give an accurate valuation of everything" },
      { title: "Complete Price Quote", subtitle: "for furniture", body: "We give you a complete price quote for all the office furniture based on our valuation. We're open to negotiation for bulk quantities" },
      { title: "Instant Payment", subtitle: "and Free Moving", body: "Once we agree, we pay cash immediately. Our team handles moving all the office furniture quickly and efficiently, for free" },
    ],
    faqTitle: "FAQ about Buying Used Office Furniture",
    faq: [
      { question: "Do you buy office furniture in bulk?", answer: "Yes, we specialize in buying office furniture in bulk, whether a single office's furniture or a full company's worth of dozens of desks and chairs." },
      { question: "How is used office furniture valued?", answer: "We value office furniture based on material, brand if any, overall condition, craftsmanship quality, age, and market demand." },
      { question: "Do you buy damaged or broken office furniture?", answer: "Yes, we buy office furniture even if it has damage or broken pieces; the price will be affected by the extent of damage." },
      { question: "How long does clearing a whole office or company take?", answer: "A small office may take 2-4 hours, a mid-size company may need a full workday, and a large company may need two days or more." },
      { question: "Do you buy office partitions and decor?", answer: "Yes, we buy partitions of every kind — wood, aluminum, glass, MDF — plus office decor like shelving and metal cabinets." },
    ],
    otherServicesTitle: "Other Services",
    otherServices: [
      { label: "Used Home Furniture", href: "/buy-used-home-furniture" as const },
      { label: "Used Bedrooms", href: "/buy-used-bedrooms" as const },
      { label: "Used Appliances" },
      { label: "Full House Clearance" },
      { label: "Antiques & Artifacts" },
      { label: "Used Kitchens" },
    ],
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Get the best price for your office furniture",
    callCta: "Call Us Now",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/buy-used-office-furniture">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/buy-used-office-furniture",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/service/office-furniture.jpg`,
  });
}

export default async function BuyUsedOfficeFurniturePage({
  params,
}: PageProps<"/[locale]/buy-used-office-furniture">) {
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
          { name: c.pageTitle, path: "/buy-used-office-furniture" },
        ]}
      />
      <FaqJsonLd items={c.faq} />
      <HowToJsonLd
        name={locale === "en" ? "How to sell your used office furniture to Aldabouqi" : "كيف تبيع أثاثك المكتبي المستعمل للدابوقي"}
        description={locale === "en" ? "Simple steps to sell used office furniture for the best price" : "خطوات بسيطة لبيع الأثاث المكتبي المستعمل بأفضل سعر"}
        steps={c.steps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={c.pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: "/buy-used-office-furniture", label: c.pageTitle },
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
