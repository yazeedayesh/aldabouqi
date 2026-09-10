import { setRequestLocale } from "next-intl/server";
import { CategoryPageTemplate } from "@/components/sections/category-page-template";
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "إفراغ منازل بالكامل في عمان | شراء محتويات المنزل كاملة - الدابوقي",
    metaDescription:
      "خدمة إفراغ منازل وشقق بالكامل في عمان: نشتري محتويات المنزل دفعة واحدة بسعر عادل وخدمة سريعة. مناسب للسفر، البيع، أو تجديد المنزل. اتصل: 0796983994",
    keywords:
      "افراغ منازل عمان, شراء اثاث منزل كامل, تخليص شقة اثاث, بيع اثاث منزل بالكامل, افراغ شقة عمان, شراء عفش منزل كامل",
    pageTitle: "إفراغ منازل بالكامل",
    breadcrumbServices: "خدماتنا",
    serviceType: "إفراغ منازل بالكامل",
    serviceName: "خدمة إفراغ المنازل بالكامل في عمان",
    serviceDescription:
      "نشتري محتويات المنزل أو الشقة بالكامل دفعة واحدة — أثاث، أجهزة، وكل ما بالمنزل — بسعر عادل وخدمة سريعة، مناسبة لمن يسافر أو يبيع منزله أو يجدده.",
    offerDescription: "تقييم شامل ومجاني لمحتويات المنزل كاملة، مع دفع نقدي فوري",
    heroImageAlt: "إفراغ منزل بالكامل في عمان",
    introImageAlt: "شراء محتويات منزل كامل عمان",
    introTitle: "إفراغ منزلك بالكامل بزيارة واحدة وسعر عادل",
    introBody:
      "لو بدك تفرغ منزلك أو شقتك بالكامل — سواء للسفر، أو البيع، أو التجديد — بنجيك ومنقيّم كل محتويات المنزل دفعة واحدة: غرف نوم، صالونات، مطبخ، أجهزة كهربائية، وكل قطعة أثاث. ما بتحتاج تبيع كل قطعة لحالها ولا تتعامل مع أكتر من طرف — كل شي بزيارة وحدة.",
    bullets: [
      "تقييم شامل لكل محتويات المنزل بزيارة واحدة",
      "نشتري الأثاث والأجهزة الكهربائية والمفروشات معاً",
      "خدمة سريعة — مناسبة لمواعيد السفر والتسليم الضيقة",
      "دفع نقدي فوري، وفريقنا يتولى الفك والنقل بالكامل",
    ],
    features: [
      { title: "زيارة واحدة شاملة", body: "بنقيّم كل محتويات المنزل بزيارة وحدة، بدون تعقيد أو مواعيد متعددة" },
      { title: "سرعة بالتنفيذ", body: "ندرك إنه إفراغ المنزل غالباً مرتبط بموعد ضاغط — بننجز بسرعة تناسبك" },
      { title: "فريق متكامل", body: "فريقنا يتولى الفك والتحميل والنقل لكل شي، بدون أي جهد منك" },
    ],
    howToTitle: "كيف تفرغ منزلك معنا؟",
    howToIntro: "عملية منظمة تخليك تفرغ بيتك براحتك بدون تعقيد.",
    steps: [
      { title: "اتصل بنا", subtitle: "وحدد موعد", body: "اتصل على 0796983994 وحدد لنا موعد المعاينة الشامل لمنزلك" },
      { title: "معاينة شاملة", subtitle: "لكل المحتويات", body: "يزورك فريقنا ويعاين كل محتويات المنزل: أثاث، أجهزة، ومفروشات" },
      { title: "عرض سعر واحد", subtitle: "لكل المنزل", body: "نقدملك سعراً واحداً شاملاً لكل محتويات المنزل، قابل للتفاوض" },
      { title: "التنفيذ الكامل", subtitle: "دفع، فك، ونقل", body: "بعد الاتفاق، ندفع نقداً ونتولى فك ونقل كل شي بنفس الزيارة أو بموعد يناسبك" },
    ],
    faqTitle: "الأسئلة الشائعة حول إفراغ المنازل",
    faq: [
      { question: "هل تشترون كل محتويات المنزل حتى لو كانت متنوعة؟", answer: "نعم، نشتري كل شي معاً: أثاث، أجهزة كهربائية، مفروشات — بتقييم شامل بزيارة واحدة." },
      { question: "كم يستغرق إفراغ المنزل بالكامل؟", answer: "حسب حجم المنزل، لكن عادة ننجز خلال يوم واحد بعد الاتفاق على السعر." },
      { question: "هل الخدمة مناسبة لو عندي موعد سفر ضيق؟", answer: "نعم، هاي من أكتر الحالات اللي منتعامل معها — نقدر ننسق موعد سريع يناسب جدولك." },
      { question: "هل بتشتروا حتى القطع البسيطة كالأواني والمفروشات؟", answer: "نركز على الأثاث والأجهزة الكهربائية بشكل أساسي، لكن اسألنا عن أي قطع إضافية عندك — بنحاول نساعدك قدر الإمكان." },
    ],
    otherServicesTitle: "خدمات أخرى",
    otherServices: [
      { label: "شراء أثاث منزلي مستعمل", href: "/buy-used-home-furniture" as const },
      { label: "شراء غرف نوم مستعملة", href: "/buy-used-bedrooms" as const },
      { label: "شراء أجهزة كهربائية مستعملة", href: "/buy-used-appliances" as const },
      { label: "شراء أنتيكات وتحف", href: "/buy-antiques" as const },
      { label: "شراء صالونات مستعملة", href: "/buy-used-sofas" as const },
      { label: "شراء مطابخ مستعملة", href: "/buy-used-kitchens" as const },
    ],
    experienceLabel: "خبرة +60 سنة",
    ctaTitle: "بدك تفرغ منزلك بالكامل؟ احصل على تقييم شامل الآن",
    callCta: "اتصل بنا الآن",
  },
  en: {
    metaTitle: "Full House Clearance in Amman | Buy Your Entire Home's Contents - Aldabouqi",
    metaDescription:
      "Full house and apartment clearance service in Amman: we buy your entire home's contents in one visit, at a fair price with fast service. Ideal for moving abroad, selling, or renovating. Call: 0796983994",
    keywords:
      "house clearance Amman, buy entire home furniture, apartment clearance Amman, sell whole house furniture, home clearance service Amman",
    pageTitle: "Full House Clearance",
    breadcrumbServices: "Services",
    serviceType: "Full House Clearance",
    serviceName: "Full House Clearance Service in Amman",
    serviceDescription:
      "We buy the entire contents of a home or apartment in one go — furniture, appliances, and everything in the house — at a fair price with fast service, ideal for anyone traveling, selling, or renovating.",
    offerDescription: "A comprehensive, free valuation of your entire home's contents, with instant cash payment",
    heroImageAlt: "Full house clearance in Amman",
    introImageAlt: "Buying a full home's contents Amman",
    introTitle: "Clear your entire home in one visit at a fair price",
    introBody:
      "If you need to clear your home or apartment entirely — whether you're moving abroad, selling, or renovating — we come and value your entire home's contents in one go: bedrooms, living rooms, kitchen, appliances, and every piece of furniture. No need to sell each piece separately or deal with multiple parties — everything in a single visit.",
    bullets: [
      "A comprehensive valuation of your entire home's contents in one visit",
      "We buy furniture, appliances, and furnishings together",
      "Fast service — suited to tight travel and handover deadlines",
      "Instant cash payment, and our team handles all disassembly and moving",
    ],
    features: [
      { title: "One Comprehensive Visit", body: "We value your entire home's contents in a single visit, no complications or multiple appointments" },
      { title: "Fast Turnaround", body: "We know house clearance is usually tied to a tight deadline — we move at a pace that works for you" },
      { title: "A Complete Team", body: "Our team handles disassembly, loading, and moving of everything, with zero effort on your part" },
    ],
    howToTitle: "How to clear your house with us?",
    howToIntro: "An organized process that lets you clear your home with ease.",
    steps: [
      { title: "Call Us", subtitle: "and Set a Time", body: "Call 0796983994 and schedule a comprehensive inspection of your home" },
      { title: "Full Inspection", subtitle: "of Everything", body: "Our team visits and inspects your entire home's contents: furniture, appliances, and furnishings" },
      { title: "One Price Offer", subtitle: "for Everything", body: "We give you one comprehensive price for the entire home's contents, open to negotiation" },
      { title: "Full Execution", subtitle: "Payment, Disassembly, Moving", body: "Once agreed, we pay cash and handle disassembly and moving, same visit or at a time that suits you" },
    ],
    faqTitle: "FAQ about House Clearance",
    faq: [
      { question: "Do you buy everything even if it's varied?", answer: "Yes, we buy it all together: furniture, appliances, furnishings — a comprehensive valuation in one visit." },
      { question: "How long does a full house clearance take?", answer: "Depending on the home's size, but usually completed within one day once a price is agreed." },
      { question: "Is this suitable if I have a tight travel deadline?", answer: "Yes, this is one of the most common cases we handle — we can arrange a fast appointment that fits your schedule." },
      { question: "Do you buy small items like dishware and linens too?", answer: "We focus mainly on furniture and appliances, but ask us about any extra items you have — we try to help as much as possible." },
    ],
    otherServicesTitle: "Other Services",
    otherServices: [
      { label: "Used Home Furniture", href: "/buy-used-home-furniture" as const },
      { label: "Used Bedrooms", href: "/buy-used-bedrooms" as const },
      { label: "Used Appliances", href: "/buy-used-appliances" as const },
      { label: "Antiques & Artifacts", href: "/buy-antiques" as const },
      { label: "Used Sofas", href: "/buy-used-sofas" as const },
      { label: "Used Kitchens", href: "/buy-used-kitchens" as const },
    ],
    experienceLabel: "60+ Years of Experience",
    ctaTitle: "Need to clear your home completely? Get a full valuation now",
    callCta: "Call Us Now",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/house-clearance">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/house-clearance",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/service/aldabouqi5.webp`,
  });
}

export default async function HouseClearancePage({ params }: PageProps<"/[locale]/house-clearance">) {
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
          { name: c.pageTitle, path: "/house-clearance" },
        ]}
      />
      <FaqJsonLd items={c.faq} />
      <HowToJsonLd
        name={locale === "en" ? "How to have Aldabouqi clear your house" : "كيف تفرغ منزلك مع الدابوقي"}
        description={locale === "en" ? "Simple steps to clear your entire home" : "خطوات بسيطة لإفراغ منزلك بالكامل"}
        steps={c.steps.map((s) => ({ name: `${s.title} ${s.subtitle}`, text: s.body }))}
      />

      <CategoryPageTemplate
        pageTitle={c.pageTitle}
        breadcrumbs={[
          { href: "/services", label: c.breadcrumbServices },
          { href: "/house-clearance", label: c.pageTitle },
        ]}
        heroImage={{ src: "/img/service/aldabouqi5.webp", alt: c.heroImageAlt }}
        introTitle={c.introTitle}
        introBody={c.introBody}
        introImage={{ src: "/img/service/aldabouqi1.webp", alt: c.introImageAlt }}
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
