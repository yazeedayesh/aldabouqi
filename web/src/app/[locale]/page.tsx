import { asc, count, eq } from "drizzle-orm";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Banknote,
  ChevronLeft,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactForm } from "@/components/forms/contact-form";
import { FaqJsonLd, LocalBusinessJsonLd } from "@/components/seo/json-ld";
import { getCategoryIcon } from "@/lib/category-icons";
import { getDb } from "@/db";
import { categories as categoriesTable, products } from "@/db/schema";
import { areas } from "@/lib/areas";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL, buildWhatsAppLink } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const AREAS_PREVIEW_COUNT = 18;

const content = {
  ar: {
    metaTitle: "شراء وبيع الأثاث المستعمل في عمان | أفضل الأسعار - الدابوقي",
    metaDescription:
      "شركة الدابوقي لشراء وبيع العفش والأثاث المستعمل في عمان وكل مناطق الأردن: غرف نوم، صالونات، مكاتب، أجهزة كهربائية. معاينة ودفع نقدي فوري. اتصل: 0796983994",
    keywords:
      "شراء الأثاث المستعمل في عمان, بيع الأثاث المستعمل, عفش مستعمل للبيع, أثاث مستعمل بأسعار جيدة, شراء غرف النوم المستعملة, بيع الأثاث في عمان",
    heroBadge: "متاحين الآن · نرد خلال دقائق",
    heroTitleStart: "شراء الأثاث المستعمل في عمّان ",
    heroTitleAccent: "بأعلى الأسعار",
    heroBody:
      "الدابوقي لشراء وبيع الأثاث المستعمل والعفش في عمان — خبرة تتجاوز ٦٠ سنة، تقييم فوري مجاني، دفع نقدي، ونقل بدون أي تكلفة.",
    heroSearchPlaceholder: "دوّر على غرفة نوم، كنب، ثلاجة…",
    heroSearchCta: "ابحث",
    heroWorkCta: "شوف شغلنا على الأرض",
    heroWorkAlt: "شراء أثاث مستعمل بأسعار مغرية في عمان",
    statExperienceValue: "+٦٠",
    statExperienceLabel: "سنة خبرة بسوق الأثاث المستعمل",
    statRatingLabel: "تقييم خرائط جوجل من عملاء حقيقيين",
    categoriesKicker: "الــمــتــجــر",
    categoriesHeading: "تصفّح الأثاث المستعمل حسب القسم",
    categoriesCountPill: "الأقسام الثمانية",
    categoryPieceUnit: "قطعة",
    categorySummarySuffix: "قطعة معروضة الآن بالمتجر",
    categorySummaryCta: "شوف الكل",
    sellBadge: "نشاطنا الأساسي منذ أكثر من ٦٠ سنة",
    sellHeading: "عندك عفش بدك تبيعه؟",
    sellIntro: "قطعة وحدة أو بيت كامل — منجيك، منقيّم، وبندفع نقدًا بنفس اليوم. بدون وسطاء ولا مواعيد ضايعة.",
    sellSteps: [
      { number: "٠١", title: "ابعت الصور", body: "على واتساب، بأي وقت" },
      { number: "٠٢", title: "معاينة مجانية", body: "بموقعك، بموعد يناسبك" },
      { number: "٠٣", title: "عرض سعر واضح", body: "وقابل للتفاوض" },
      { number: "٠٤", title: "دفع نقدي ونقل", body: "بنفس الزيارة، والنقل علينا" },
    ],
    sellCta: "ابعت صور أثاثك",
    whyKicker: "لــيــش الــدابــوقــي",
    whyTitle: "ليش تختار الدابوقي لشراء وبيع أثاثك المستعمل",
    why: [
      { title: "تصنيف حالة صادق", body: "ممتازة، جيدة جدًا، جيدة — بمعايير مكتوبة ومنشورة. بتعرف بالضبط شو رح يوصلك قبل ما تشتري." },
      { title: "دفع نقدي فوري", body: "بنفس زيارة المعاينة، بدون شيكات ولا تأجيل ولا خصومات مفاجئة على السعر المتفق عليه." },
      { title: "النقل علينا", body: "فريق وسيارة نقل، بدون أي تكلفة إضافية — حتى للطوابق العليا وبدون مصعد." },
    ],
    ratingValue: "٤٫٩",
    ratingBody: "تقييم خرائط جوجل من عملاء حقيقيين تعاملوا معنا.",
    ratingCta: "قيّمنا على جوجل",
    reviewLabel: "تقييم من خرائط جوجل",
    reviews: [
      "هاي شهادة رح أُسأل عنها يوم القيامة - ناس محترمين، الله يعطيهم الصحة.",
      "من أحسن الأثاث المستعمل، وعملية البيع والشراء تمام - من تجربة شخصية. بالتوفيق وعقبال المزيد 💪",
    ],
    areasHeading: "مناطق شراء الأثاث المستعمل في عمّان",
    areasBody: "كل منطقة إلها صفحتها مع تفاصيل الخدمة فيها. ما لقيت منطقتك؟ اتصل فينا — الأغلب منغطيها.",
    areasMoreSuffix: "منطقة إضافية",
    faqKicker: "كيف يمكننا مساعدتك؟",
    faqTitle: "أكتر شي بينسألونا عنه",
    faq: [
      { question: "كيف بتحددوا سعر الأثاث المستعمل؟", answer: "بننظر لثلاث أشياء: حالة القطعة الفعلية، نوع الخامة وعمرها، وسعر السوق اليوم لقطع مشابهة. منعرضلك السعر ومنشرحلك على شو مبني، والتفاوض مفتوح." },
      { question: "بتشتروا قطعة وحدة ولا بس بيت كامل؟", answer: "الاثنين. منشتري قطعة وحدة زي ما منشتري أثاث بيت كامل، وما في حد أدنى للطلب. لو عندك قطعة وحدة بس، ابعتلنا صورها على واتساب ومنقيّمها ومنعطيك سعر — نفس الطريقة بالضبط." },
      { question: "المعاينة والنقل عليّ ولا عليكم؟", answer: "الاثنين علينا. المعاينة مجانية تمامًا — بيوصلك أحد خبرائنا لموقعك بموعد يناسبك بدون أي رسوم، حتى لو ما اتفقنا على سعر بالآخر. والنقل كمان علينا: عنا فريق وسيارة نقل، وما منحمّلك أي تكلفة إضافية — حتى للطوابق العليا وبدون مصعد." },
      { question: "كيف أتأكد إنه القطعة بحالة كويسة قبل ما أشتري؟", answer: "بثلاث طرق. أولًا، كل قطعة بالمتجر مصنّفة بوضوح (ممتازة / جيدة جدًا / جيدة) حسب معايير مكتوبة ومنشورة — بتعرف بالضبط شو يعني كل تصنيف. ثانيًا، صور القطعة حقيقية للقطعة نفسها ومنوضح فيها أي أثر استخدام بدل ما نخبيه. ثالثًا، فيك تعاينها على أرض الواقع قبل ما تأكّد الشراء — اسألنا على واتساب ومنرتّبلك معاينة." },
    ],
    contactKicker: "تواصل معنا",
    contactBody: "أسرع طريقة هي واتساب — منرد خلال دقائق، ٢٤ ساعة، ٧ أيام.",
    contactWhatsappCta: "راسلنا على واتساب",
  },
  en: {
    metaTitle: "Buy Used Furniture in Amman at the Best Prices | Aldabouqi",
    metaDescription:
      "Aldabouqi specializes in buying used furniture in Amman at the best prices. We buy bedrooms, office furniture, and used appliances. Call now for an instant, free valuation!",
    keywords:
      "buy used furniture Amman, sell used furniture Jordan, cash for furniture Amman, sell my furniture Amman, used living room furniture buyer",
    heroBadge: "Available now · we reply in minutes",
    heroTitleStart: "Buy Used Furniture in Amman ",
    heroTitleAccent: "at the Best Prices",
    heroBody:
      "Aldabouqi buys and sells used furniture in Amman — over 60 years of experience, an instant free valuation, cash payment, and free moving at no extra cost.",
    heroSearchPlaceholder: "Search for a bedroom, sofa, fridge…",
    heroSearchCta: "Search",
    heroWorkCta: "See our work on the ground",
    heroWorkAlt: "Buy used furniture at great prices in Amman",
    statExperienceValue: "60+",
    statExperienceLabel: "years of experience in the used-furniture market",
    statRatingLabel: "Google Maps rating from real customers",
    categoriesKicker: "THE STORE",
    categoriesHeading: "Browse Used Furniture by Category",
    categoriesCountPill: "8 Categories",
    categoryPieceUnit: "items",
    categorySummarySuffix: "items live in the store right now",
    categorySummaryCta: "See All",
    sellBadge: "Our core business for over 60 years",
    sellHeading: "Have Furniture You Want to Sell?",
    sellIntro: "A single piece or a whole household — we come, we value it, and we pay cash the same day. No middlemen, no wasted appointments.",
    sellSteps: [
      { number: "01", title: "Send Photos", body: "On WhatsApp, any time" },
      { number: "02", title: "Free Inspection", body: "At your place, at a time that suits you" },
      { number: "03", title: "A Clear Offer", body: "And open to negotiation" },
      { number: "04", title: "Cash & Moving", body: "Same visit — moving is on us" },
    ],
    sellCta: "Send Your Furniture Photos",
    whyKicker: "WHY ALDABOUQI",
    whyTitle: "Why Choose Aldabouqi to Buy and Sell Your Used Furniture",
    why: [
      { title: "Honest Condition Grading", body: "Excellent, very good, good — by written, published standards. You know exactly what you'll get before you buy." },
      { title: "Instant Cash Payment", body: "At the same inspection visit, no checks, no delays, no surprise discounts off the agreed price." },
      { title: "Moving Is On Us", body: "Our own team and truck, at no extra cost — even for upper floors with no elevator." },
    ],
    ratingValue: "4.9",
    ratingBody: "Google Maps rating from real customers we've worked with.",
    ratingCta: "Rate us on Google",
    reviewLabel: "Google Maps Review",
    reviews: [
      "This is a testimony I'll be asked about on Judgment Day - respectable people, God grant them good health.",
      "Some of the finest used furniture around, and the buying/selling process is excellent - from personal experience. Best of luck and onward! 💪",
    ],
    areasHeading: "Used Furniture Buying Areas in Amman",
    areasBody: "Every area has its own page with service details. Can't find your area? Call us — we cover most of them.",
    areasMoreSuffix: "more areas",
    faqKicker: "How can we help you?",
    faqTitle: "Frequently Asked Questions",
    faq: [
      { question: "How do you determine the price of used furniture?", answer: "We look at three things: the piece's actual condition, the material type and age, and today's market price for similar pieces. We'll show you the price and explain what it's based on, and negotiation is always open." },
      { question: "Do you buy single pieces, or only full households?", answer: "Both. We buy a single piece just as we buy furniture from a whole household, and there's no minimum order. If you only have one piece, send us photos on WhatsApp and we'll value it and give you a price — the exact same way." },
      { question: "Is the inspection and moving on me or on you?", answer: "Both are on us. The inspection is completely free — one of our experts comes to your location at a time that suits you, with no fees, even if we don't agree on a price in the end. Moving is on us too: we have our own team and truck, and we don't charge any extra cost — even for upper floors with no elevator." },
      { question: "How do I make sure a piece is in good condition before I buy?", answer: "Three ways. First, every piece in the store is clearly graded (excellent / very good / good) by written, published standards — you know exactly what each grade means. Second, the photos are real photos of the actual piece, showing any wear honestly instead of hiding it. Third, you can inspect it in person before you commit to buying — ask us on WhatsApp and we'll arrange a viewing." },
    ],
    contactKicker: "Get in Touch",
    contactBody: "The fastest way is WhatsApp — we reply within minutes, 24/7.",
    contactWhatsappCta: "Message Us on WhatsApp",
  },
} as const;

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/logo/aldabouqi-black.webp`,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];
  const loc = locale as "ar" | "en";
  const isEn = loc === "en";

  const [categoryRows, categoryCounts, [{ value: totalAvailable }]] = await Promise.all([
    getDb().select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder)),
    getDb()
      .select({ category: products.category, value: count() })
      .from(products)
      .where(eq(products.status, "available"))
      .groupBy(products.category),
    getDb().select({ value: count() }).from(products).where(eq(products.status, "available")),
  ]);
  const countByCategory = new Map(categoryCounts.map((r) => [r.category, r.value]));

  const areasPreview = areas.slice(0, AREAS_PREVIEW_COUNT);
  const areasMoreCount = areas.length - areasPreview.length;

  const searchAction = isEn ? "/en/store" : "/store";

  return (
    <>
      <LocalBusinessJsonLd
        description={c.metaDescription}
        aggregateRating={{ ratingValue: "4.9", reviewCount: "10" }}
      />
      <FaqJsonLd items={c.faq} />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_468px]">
          <div className="flex min-h-[420px] flex-col justify-center rounded-[22px] bg-card p-6 sm:min-h-[520px] sm:rounded-[32px] sm:p-13">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3.5 py-2 text-xs font-bold text-primary sm:text-[13px]">
              <span className="size-1.5 rounded-full bg-vivid" />
              {c.heroBadge}
            </span>
            <h1 className="font-heading text-[32px] font-black leading-[1.24] tracking-tight text-foreground sm:text-[62px] sm:leading-[1.16]">
              {c.heroTitleStart}
              <span className="text-primary">{c.heroTitleAccent}</span>
            </h1>
            <p className="mt-3.5 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground sm:mt-5 sm:text-[17.5px] sm:leading-[1.85]">
              {c.heroBody}
            </p>

            <form
              action={searchAction}
              method="GET"
              className="mt-6 flex h-[58px] items-center gap-2.5 rounded-full bg-secondary px-1.5 ps-4.5 sm:mt-9.5 sm:h-18"
            >
              <Search className="size-[19px] shrink-0 text-muted-foreground" strokeWidth={2} />
              <input
                type="search"
                name="q"
                placeholder={c.heroSearchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-[15px]"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-full bg-ink px-5 text-[13.5px] font-bold text-ink-foreground sm:h-14 sm:px-7 sm:text-[15px]"
              >
                {c.heroSearchCta}
              </button>
            </form>
          </div>

          <div className="hidden flex-col gap-4 lg:flex">
            <div className="relative min-h-[344px] flex-1 overflow-hidden rounded-[32px]">
              <Image
                src="/img/hero/furntuer.webp"
                alt={c.heroWorkAlt}
                fill
                priority
                className="object-cover"
                sizes="468px"
              />
              <div className="absolute inset-x-4 bottom-4 flex h-[62px] items-center justify-between rounded-full bg-card/92 ps-5.5 pe-2">
                <span className="text-sm font-semibold text-foreground">{c.heroWorkCta}</span>
                <span className="flex size-11.5 items-center justify-center rounded-full bg-ink text-ink-foreground">
                  <ChevronLeft className="size-4.5 rtl:rotate-0 ltr:rotate-180" strokeWidth={2.2} />
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-center rounded-[28px] bg-ink p-6 text-ink-foreground">
                <div className="font-heading text-[44px] font-black leading-none tracking-tight">
                  {c.statExperienceValue}
                </div>
                <div className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{c.statExperienceLabel}</div>
              </div>
              <div className="flex flex-col justify-center rounded-[28px] bg-mint p-6">
                <div className="mb-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-[44px] font-black leading-none tracking-tight text-primary">
                    {c.ratingValue}
                  </span>
                  <Star className="size-4.5 fill-primary text-primary" />
                </div>
                <div className="text-[13.5px] leading-relaxed text-mint-foreground">{c.statRatingLabel}</div>
              </div>
            </div>
          </div>

          {/* Mobile stat pills — same data, stacked layout */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            <div className="rounded-[22px] bg-ink p-[18px] text-ink-foreground">
              <div className="font-heading text-[30px] font-black leading-none tracking-tight">
                {c.statExperienceValue}
              </div>
              <div className="mt-1.5 text-xs leading-snug text-ink-muted">{c.statExperienceLabel}</div>
            </div>
            <div className="rounded-[22px] bg-mint p-[18px]">
              <div className="mb-1.5 flex items-baseline gap-1">
                <span className="font-heading text-[30px] font-black leading-none tracking-tight text-primary">
                  {c.ratingValue}
                </span>
                <Star className="size-3.5 fill-primary text-primary" />
              </div>
              <div className="text-xs leading-snug text-mint-foreground">{c.statRatingLabel}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-3 pt-14 sm:px-5 sm:pt-19">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 px-1 sm:mb-6.5 sm:px-5">
          <div>
            <div className="mb-2.5 text-xs font-bold tracking-[2px] text-primary sm:mb-3">{c.categoriesKicker}</div>
            <h2 className="font-heading text-[26px] font-black tracking-tight text-foreground sm:text-[42px]">
              {c.categoriesHeading}
            </h2>
          </div>
          <div className="hidden h-13 items-center rounded-full bg-card px-6.5 text-[15px] font-bold text-foreground shadow-sm sm:flex">
            {c.categoriesCountPill}
            <ChevronLeft className="ms-2.5 size-4 text-primary rtl:rotate-0 ltr:rotate-180" strokeWidth={2.2} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categoryRows.map((cat) => {
            const name = isEn ? cat.nameEn : cat.nameAr;
            const catCount = countByCategory.get(cat.slug) ?? 0;
            return (
              <Reveal key={cat.slug}>
                <Link
                  href={`/store/${cat.slug}`}
                  className="group relative block h-[168px] overflow-hidden rounded-[22px] sm:h-[300px] sm:rounded-[28px]"
                >
                  {cat.image ? (
                    <>
                      <Image
                        src={cat.image}
                        alt={isEn ? `Used ${name} for sale in Amman` : `${name} مستعملة للبيع في عمّان`}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 640px) 25vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/86 via-ink/5 to-transparent" />
                      <span className="absolute start-3.5 top-3.5 hidden h-[30px] items-center rounded-full bg-card/94 px-3.5 text-[12.5px] font-bold text-foreground sm:flex">
                        {catCount} {c.categoryPieceUnit}
                      </span>
                      <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between sm:inset-x-5 sm:bottom-[18px]">
                        <div className="text-white sm:hidden">
                          <div className="mb-1 text-[11px] opacity-80">
                            {catCount} {c.categoryPieceUnit}
                          </div>
                          <div className="font-heading text-base font-extrabold">{name}</div>
                        </div>
                        <span className="hidden font-heading text-xl font-extrabold text-white sm:block">
                          {name}
                        </span>
                        <span className="hidden size-10 items-center justify-center rounded-full bg-card sm:flex">
                          <ChevronLeft className="size-[17px] text-foreground rtl:rotate-0 ltr:rotate-180" strokeWidth={2.2} />
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex size-full flex-col justify-between bg-card p-4 transition-colors group-hover:bg-accent sm:p-6">
                      {(() => {
                        const Icon = getCategoryIcon(cat.slug);
                        return <Icon className="size-6 text-primary sm:size-[30px]" strokeWidth={1.5} />;
                      })()}
                      <div>
                        <div className="mb-1 text-[11px] text-muted-foreground sm:text-[11.5px]">
                          {catCount} {c.categoryPieceUnit}
                        </div>
                        <div className="font-heading text-base font-extrabold text-foreground sm:text-lg">{name}</div>
                      </div>
                    </div>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <Link
            href="/store"
            className="mt-3 flex flex-col items-start justify-between gap-4 rounded-[22px] bg-primary p-6 text-primary-foreground sm:mt-4 sm:flex-row sm:items-center sm:rounded-[28px] sm:p-8"
          >
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-3xl font-black tracking-tight sm:text-[40px]">{totalAvailable}</span>
              <span className="text-sm opacity-90 sm:text-[15px]">{c.categorySummarySuffix}</span>
            </div>
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-card px-4.5 text-[13.5px] font-bold text-primary">
              {c.categorySummaryCta}
              <ChevronLeft className="size-[15px] rtl:rotate-0 ltr:rotate-180" strokeWidth={2.3} />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* Sell to us */}
      <section className="mx-auto max-w-7xl px-3 pt-14 sm:px-5 sm:pt-19">
        <div className="overflow-hidden rounded-[28px] bg-ink text-ink-foreground sm:rounded-[40px]">
          <div className="grid gap-8 p-6 sm:grid-cols-2 sm:items-center sm:p-13">
            <div>
              <span className="mb-5 inline-flex h-8.5 items-center rounded-full bg-white/10 px-4 text-xs font-bold text-vivid-light sm:mb-6.5">
                {c.sellBadge}
              </span>
              <h2 className="font-heading text-[32px] font-black leading-[1.15] tracking-tight sm:text-[50px]">
                {c.sellHeading}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-[1.8] text-ink-muted sm:mt-5 sm:text-[17px] sm:leading-[1.9]">
                {c.sellIntro}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3.5 sm:mt-9">
                {c.sellSteps.map((step) => (
                  <div key={step.number} className="rounded-[20px] bg-white/6 p-5">
                    <div className="mb-2 font-heading text-sm font-black text-vivid">{step.number}</div>
                    <div className="mb-1 text-[15px] font-bold text-ink-foreground">{step.title}</div>
                    <div className="text-[13px] text-ink-muted">{step.body}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-9">
                <a
                  href={buildWhatsAppLink(isEn ? "Hi, I'd like to sell my used furniture" : "مرحباً، بدي أبيع أثاثي المستعمل")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[54px] items-center gap-2.5 rounded-full bg-vivid px-7 text-[16px] font-extrabold text-whatsapp-foreground sm:h-[58px] sm:px-7.5 sm:text-[16.5px]"
                >
                  <MessageCircle className="size-5" strokeWidth={2} />
                  {c.sellCta}
                </a>
                <a
                  href={`tel:${BUSINESS.phoneE164}`}
                  dir="ltr"
                  className="flex h-[54px] items-center gap-2.5 rounded-full border-[1.5px] border-white/28 px-6.5 text-[15.5px] font-bold text-ink-foreground sm:h-[58px] sm:px-7"
                >
                  <Phone className="size-[18px]" strokeWidth={1.8} />
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="relative hidden min-h-[300px] overflow-hidden rounded-[28px] sm:block">
              <Image
                src="/img/service/aldabouqi2.webp"
                alt={c.sellHeading}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 0px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-3 pt-14 sm:px-5 sm:pt-19">
        <div className="mb-5 px-1 sm:mb-7 sm:px-5">
          <div className="mb-2.5 text-xs font-bold tracking-[2px] text-primary sm:mb-3">{c.whyKicker}</div>
          <h2 className="max-w-2xl font-heading text-[26px] font-black leading-[1.25] tracking-tight text-foreground sm:text-[42px]">
            {c.whyTitle}
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {c.why.map((item, i) => {
            const Icon = [ShieldCheck, Banknote, Truck][i];
            return (
              <Reveal key={item.title} delayMs={i * 100}>
                <div className="rounded-[22px] bg-card p-6 sm:rounded-[28px] sm:p-8.5">
                  <div className="mb-5 flex size-[54px] items-center justify-center rounded-[18px] bg-accent sm:mb-6">
                    <Icon className="size-6" strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-3 font-heading text-lg font-extrabold text-foreground sm:text-[21px]">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.9] text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-3 pt-14 sm:px-5 sm:pt-19">
        <div className="grid gap-3 sm:grid-cols-[420px_minmax(0,1fr)] sm:gap-4">
          <div className="flex flex-col justify-between gap-6 rounded-[24px] bg-mint p-6 sm:rounded-[32px] sm:p-10">
            <div>
              <span className="font-heading text-[44px] font-black leading-none tracking-tight text-primary sm:text-[64px]">
                {c.ratingValue}
              </span>
              <div className="mt-2.5 mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-[15px] leading-[1.9] text-mint-foreground">{c.ratingBody}</p>
            </div>
            <a
              href="https://g.page/r/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-bold text-primary-foreground"
            >
              <Star className="size-[17px] fill-current" />
              {c.ratingCta}
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {c.reviews.map((review, index) => (
              <Reveal key={index} delayMs={index * 100}>
                <div className="flex h-full flex-col justify-center rounded-[22px] bg-card p-6 sm:rounded-[28px] sm:p-8">
                  <p className="font-heading text-lg font-bold leading-[1.65] tracking-tight text-foreground sm:text-xl">
                    &ldquo;{review}&rdquo;
                  </p>
                  <p className="mt-4 text-[13px] text-muted-foreground">{c.reviewLabel}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="mx-auto max-w-7xl px-3 pt-14 sm:px-5 sm:pt-19">
        <div className="rounded-[28px] bg-card p-6 sm:rounded-[40px] sm:p-12">
          <div className="grid gap-6 sm:grid-cols-[380px_minmax(0,1fr)] sm:items-start sm:gap-13">
            <div>
              <h2 className="font-heading text-2xl font-black leading-[1.25] tracking-tight text-foreground sm:text-[34px]">
                {c.areasHeading}
              </h2>
              <p className="mt-3.5 text-[15px] leading-[1.9] text-muted-foreground">{c.areasBody}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {areasPreview.map((area) => (
                <Link
                  key={area.slug}
                  href={`/areas/${area.slug}`}
                  className="flex h-10 items-center rounded-full bg-secondary px-4 text-sm font-semibold text-foreground hover:bg-accent hover:text-primary sm:h-10.5 sm:px-4.5 sm:text-[14.5px]"
                >
                  {isEn ? area.nameEn : area.nameAr}
                </Link>
              ))}
              {areasMoreCount > 0 && (
                <Link
                  href="/coverage-areas"
                  className="flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-ink-foreground sm:h-10.5 sm:px-4.5 sm:text-[14.5px]"
                >
                  {isEn ? `+${areasMoreCount} ${c.areasMoreSuffix}` : `و${areasMoreCount} ${c.areasMoreSuffix}`}
                  <ChevronLeft className="size-[15px] rtl:rotate-0 ltr:rotate-180" strokeWidth={2.2} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + Contact */}
      <section className="mx-auto max-w-7xl px-3 pt-14 pb-14 sm:px-5 sm:pt-19 sm:pb-19">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_440px] sm:items-start sm:gap-4">
          <div className="rounded-[24px] bg-card p-6 sm:rounded-[32px] sm:p-11">
            <h2 className="mb-5 font-heading text-2xl font-black tracking-tight text-foreground sm:mb-6.5 sm:text-[34px]">
              {c.faqTitle}
            </h2>
            <FaqSection items={c.faq} />
          </div>
          <div className="rounded-[24px] bg-ink p-6 text-ink-foreground sm:rounded-[32px] sm:p-10">
            <h3 className="mb-3 font-heading text-xl font-black tracking-tight sm:text-[28px]">{c.contactKicker}</h3>
            <p className="mb-6 text-[15px] leading-[1.9] text-ink-muted sm:mb-7">{c.contactBody}</p>
            <a
              href={buildWhatsAppLink(c.contactWhatsappCta)}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2.5 flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-vivid text-[16px] font-extrabold text-whatsapp-foreground sm:h-[58px] sm:text-[16.5px]"
            >
              <MessageCircle className="size-5" strokeWidth={2} />
              {c.contactWhatsappCta}
            </a>
            <a
              href={`tel:${BUSINESS.phoneE164}`}
              dir="ltr"
              className="mb-7 flex h-[50px] items-center justify-center gap-2.5 rounded-full border-[1.5px] border-white/24 text-[15px] font-bold sm:h-[54px] sm:text-base"
            >
              <Phone className="size-[18px]" strokeWidth={1.8} />
              {BUSINESS.phoneDisplay}
            </a>
            <div className="space-y-3.5 border-t border-white/12 pt-6 text-sm text-ink-muted sm:text-[14.5px]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-[18px] shrink-0 text-vivid" strokeWidth={1.8} />
                {isEn
                  ? `${BUSINESS.address.localityAr}, Jordan`
                  : `${BUSINESS.address.streetAddressAr}، ${BUSINESS.address.localityAr}`}
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="size-[18px] shrink-0 text-vivid" strokeWidth={1.8} />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-white">
                  {BUSINESS.email}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-[24px] bg-card p-6 sm:mt-4 sm:rounded-[32px] sm:p-8">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
