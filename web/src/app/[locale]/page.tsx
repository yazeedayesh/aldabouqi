import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  BadgeCheck,
  Banknote,
  Clock,
  MessageCircle,
  Phone,
  Sofa,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactForm } from "@/components/forms/contact-form";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL, buildWhatsAppLink } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شراء وبيع الأثاث المستعمل في عمان | أفضل الأسعار - الدابوقي",
    metaDescription:
      "شركة الدابوقي لشراء وبيع العفش والأثاث المستعمل في عمان وكل مناطق الأردن: غرف نوم، صالونات، مكاتب، أجهزة كهربائية. معاينة ودفع نقدي فوري. اتصل: 0796983994",
    keywords:
      "شراء الأثاث المستعمل في عمان, بيع الأثاث المستعمل, عفش مستعمل للبيع, أثاث مستعمل بأسعار جيدة, شراء غرف النوم المستعملة, بيع الأثاث في عمان",
    heroKicker: "تبحث عن الخيار الأفضل لبيع أثاثك المستعمل؟",
    heroTitleLine1: "شراء الأثاث المستعمل في عمان",
    heroTitleLine2: "بأعلى الأسعار وأسرع خدمة",
    heroBadgeValue: "+50 ألف",
    heroBadgeLabel: "عميل موثوق من جميع أنحاء المملكة",
    heroBody:
      "الدابوقي لشراء الأثاث المستعمل في الأردن، ونعطيك أعلى الأسعار وأسرع خدمة. لا تضيع وقتك مع خيارات أخرى، تواصل مع الدابوقي اليوم واستمتع بتقييم فوري وعادل لأثاثك مع خدمة مباشرة إلى موقعك في كل مكان في عمان.",
    highlights: [
      { icon: Banknote, title: "أفضل الأسعار في السوق", body: "نقدم لك أسعارًا عادلة مقابل أثاثك المستعمل، مع تقييم مجاني وشفاف" },
      { icon: Sofa, title: "نشتري جميع أنواع الأثاث", body: "من غرف المعيشة، غرف النوم، المكاتب، والأثاث المكتبي وحتى الأجهزة الكهربائية" },
      { icon: Clock, title: "خدمة سريعة وموثوقة", body: "عملية البيع تتم بسرعة وسهولة دون أي تعقيد. نصل إليك أينما كنت في عمان" },
    ],
    aboutKicker: "من نحن",
    aboutTitle: "نحن شركة الدابوقي لشراء الأثاث المستعمل في عمان",
    aboutBody:
      "إذا كنت تبحث عن شراء الأثاث المستعمل في عمان بأسعار تنافسية وعادلة، فأنت في المكان الصحيح. تقدم شركة الدابوقي خدمة شراء جميع أنواع الأثاث المستعمل في مختلف مناطق عمان وضواحيها، بالإضافة إلى خدمات شراء الأجهزة الكهربائية المستعملة بأسعار مغرية.",
    aboutCta: "المزيد عنا",
    servicesKicker: "خدماتنا",
    servicesTitle: "نحن هنا لنبني معكم مستقبلكم من خلال بيع الأثاث المستعمل بأفضل الأسعار",
    servicesCta: "عرض جميع خدماتنا",
    services: [
      { title: "شراء الأثاث المستعمل في عمان", body: "خدمة شراء الأثاث المستعمل بأسعار مناسبة لجميع الأنواع، سواء غرف المعيشة أو غرف النوم أو المكاتب.", href: "/services" as const },
      { title: "بيع الأثاث المستعمل بسهولة وأمان", body: "خدمة بيع الأثاث المستعمل بأعلى درجة من الأمان والسهولة، مع تقييم دقيق وشفاف.", href: "/services" as const },
      { title: "شراء غرف النوم المستعملة", body: "خدمة شراء غرف النوم المستعملة في عمان، مع ضمان أفضل الأسعار للجودة الممتازة.", href: "/buy-used-bedrooms" as const },
      { title: "شراء المكاتب المستعملة", body: "خدمات شراء المكاتب المستعملة في عمان بكل سهولة، مع تقييم دقيق وضمان أفضل الأسعار.", href: "/buy-used-office-furniture" as const },
    ],
    whyKicker: "لماذا تختارنا؟",
    whyTitle: "نساعدك على بناء مستقبلك باستخدام الأثاث المستعمل بأفضل الأسعار",
    why: [
      { title: "استجابة سريعة", body: "نقدم لك استجابة سريعة لجميع استفساراتك حول شراء وبيع الأثاث المستعمل، وتقديم أفضل الأسعار." },
      { title: "توصيات عالية", body: "نتميز بتقديم خدمات شراء وبيع الأثاث المستعمل بنجاح كامل، مع توصيات من العملاء السعداء." },
      { title: "نجاح مضمون", body: "خدماتنا معتمدة على النجاح التام في بيع وشراء الأثاث المستعمل بجودة ممتازة." },
      { title: "مهندسون محترفون", body: "فريقنا من المهندسين المحترفين يضمن لك خدمات عالية الجودة عند شراء أو بيع الأثاث المستعمل." },
    ],
    testimonialsKicker: "آراء عملائنا",
    testimonialsTitle: "موثوقين من زباين حقيقيين بعمان",
    ratingValue: "4.9",
    ratingLabel: "تقييم خرائط جوجل",
    reviewLabel: "تقييم من خرائط جوجل",
    reviews: [
      "هاي شهادة رح أُسأل عنها يوم القيامة - ناس محترمين، الله يعطيهم الصحة.",
      "من أحسن الأثاث المستعمل، وعملية البيع والشراء تمام - من تجربة شخصية. بالتوفيق وعقبال المزيد 💪",
      "خدمة ممتازة.",
      "ممتاز.",
    ],
    stats: [
      { value: "+9", label: "سنوات خبرة" },
      { value: "36", label: "منطقة نغطيها بعمان" },
      { value: "24/7", label: "متاحين على مدار الساعة" },
      { value: "نقدًا", label: "دفع فوري بدون تأجيل" },
    ],
    faqKicker: "كيف يمكننا مساعدتك؟",
    faqTitle: "اكتشف الأسئلة الشائعة",
    faq: [
      { question: "أين يجب أن أبدأ مشروع شراء الأثاث المستعمل؟", answer: "ابدأ بتحديد المكان الذي تريد شراء الأثاث المستعمل منه، وابحث عن الأماكن الموثوقة التي تضمن لك الأثاث الجيد بأفضل الأسعار." },
      { question: "ما هي أنواع الأثاث المستعمل التي يمكنني شراءها؟", answer: "يمكنك شراء أثاث من مختلف الأنواع مثل غرف النوم، غرف المعيشة، المكاتب، والكراسي والطاولات بأسعار مميزة وجودة عالية." },
      { question: "كيف يمكنني ضمان أن الأثاث المستعمل بحالة جيدة؟", answer: "تأكد من فحص الأثاث جيدًا قبل شراءه، والتحقق من حالته، وعمره، ومدى إمكانية إصلاح أي تلف موجود." },
    ],
    contactKicker: "استفسر الآن",
    contactBody: "سوف نرد عليك في غضون 24 ساعة.",
  },
  en: {
    metaTitle: "Buy Used Furniture in Amman at the Best Prices | Aldabouqi",
    metaDescription:
      "Aldabouqi specializes in buying used furniture in Amman at the best prices. We buy bedrooms, office furniture, and used appliances. Call now for an instant, free valuation!",
    keywords:
      "buy used furniture Amman, sell used furniture Jordan, cash for furniture Amman, sell my furniture Amman, used living room furniture buyer",
    heroKicker: "Looking for the best way to sell your used furniture?",
    heroTitleLine1: "Buy Used Furniture in Amman",
    heroTitleLine2: "At the Best Prices & Fastest Service",
    heroBadgeValue: "50k+",
    heroBadgeLabel: "trusted customers across the Kingdom",
    heroBody:
      "Aldabouqi buys used furniture across Jordan, offering you the best prices and fastest service. Don't waste time with other options — contact Aldabouqi today and enjoy a fair, instant valuation with service delivered directly to your location anywhere in Amman.",
    highlights: [
      { icon: Banknote, title: "Best Prices in the Market", body: "We offer fair prices for your used furniture, with a free, transparent valuation" },
      { icon: Sofa, title: "We buy all types of furniture", body: "From living rooms, bedrooms, and offices to office furniture and used appliances" },
      { icon: Clock, title: "Fast & Reliable Service", body: "The selling process is fast and hassle-free. We come to you wherever you are in Amman" },
    ],
    aboutKicker: "About Us",
    aboutTitle: "We are Aldabouqi, buyers of used furniture in Amman",
    aboutBody:
      "If you're looking to sell used furniture in Amman for competitive, fair prices, you're in the right place. Aldabouqi buys all types of used furniture across Amman and its suburbs, as well as used appliances at attractive prices.",
    aboutCta: "More About Us",
    servicesKicker: "Services",
    servicesTitle: "We're here to build your future together by buying your used furniture at the best prices",
    servicesCta: "View All Our Services",
    services: [
      { title: "Buy Used Furniture in Amman", body: "A used furniture buying service at fair prices for all furniture types, whether living rooms, bedrooms, or offices.", href: "/services" as const },
      { title: "Sell used furniture easily and safely", body: "A used furniture selling service with the highest level of safety and ease, with an accurate valuation.", href: "/services" as const },
      { title: "Used Bedrooms", body: "A used bedroom buying service in Amman, with guaranteed best prices for excellent quality.", href: "/buy-used-bedrooms" as const },
      { title: "Used Office Furniture", body: "Used office furniture buying services made easy, with an accurate valuation and guaranteed best prices.", href: "/buy-used-office-furniture" as const },
    ],
    whyKicker: "Why Choose Us?",
    whyTitle: "We help you build your future by getting the best prices for your used furniture.",
    why: [
      { title: "Fast Response", body: "We offer a fast response to all your inquiries about buying and selling used furniture, with the best prices." },
      { title: "Highly Recommended", body: "We pride ourselves on successfully buying and selling used furniture, backed by recommendations from happy customers." },
      { title: "Guaranteed Success", body: "Our services are built on a proven track record of buying and selling used furniture with excellent quality." },
      { title: "Professional Team", body: "Our team of professionals ensures high-quality service whenever you buy or sell used furniture." },
    ],
    testimonialsKicker: "Customer Reviews",
    testimonialsTitle: "Trusted by real customers in Amman",
    ratingValue: "4.9",
    ratingLabel: "Google Maps Rating",
    reviewLabel: "Google Maps Review",
    reviews: [
      "This is a testimony I'll be asked about on Judgment Day - respectable people, God grant them good health.",
      "Some of the finest used furniture around, and the buying/selling process is excellent - from personal experience. Best of luck and onward! 💪",
      "Excellent service.",
      "Excellent.",
    ],
    stats: [
      { value: "9+", label: "Years of Experience" },
      { value: "36", label: "Areas Covered in Amman" },
      { value: "24/7", label: "Available Around the Clock" },
      { value: "Cash", label: "Instant Payment, No Delay" },
    ],
    faqKicker: "How can we help you?",
    faqTitle: "Explore our FAQ",
    faq: [
      { question: "Where do I start selling my used furniture?", answer: "Start by identifying where you want to sell your used furniture, and look for a trusted buyer who guarantees a fair price for quality furniture." },
      { question: "What types of used furniture do you buy?", answer: "We buy furniture of all kinds — bedrooms, living rooms, offices, chairs and tables — at great prices with a fair assessment of quality." },
      { question: "How do you ensure the furniture is in good condition?", answer: "We carefully inspect the furniture on-site, checking its condition, age, and whether any damage can be repaired — before giving you a fair offer." },
    ],
    contactKicker: "Inquire Now",
    contactBody: "We'll get back to you within 24 hours.",
  },
} as const;

const whyIcons = [Clock, ThumbsUp, TrendingUp, BadgeCheck];

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

  return (
    <>
      <LocalBusinessJsonLd
        description={c.metaDescription}
        aggregateRating={{ ratingValue: "4.9", reviewCount: "10" }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary/30">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="space-y-6">
            <p className="font-medium text-primary">{c.heroKicker}</p>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              {c.heroTitleLine1}
              <br />
              {c.heroTitleLine2}
            </h1>
            <div className="flex items-center gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                {c.heroBadgeValue}
              </span>
              <span className="text-sm text-muted-foreground">{c.heroBadgeLabel}</span>
            </div>
            <p className="max-w-xl leading-relaxed text-muted-foreground">{c.heroBody}</p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-[#25D366] text-white hover:bg-[#1ebe57]"
                nativeButton={false}
                render={
                  <a
                    href={buildWhatsAppLink(
                      locale === "en"
                        ? "Hi, I'd like to ask about selling used furniture"
                        : "مرحباً، بدي أستفسر عن شراء الأثاث المستعمل"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircle className="size-5" />
                WhatsApp
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<a href={`tel:${BUSINESS.phoneE164}`} />}>
                <Phone className="size-5" />
                {locale === "en" ? "Call Now" : "اتصل الآن"}
              </Button>
            </div>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/img/hero/furntuer.webp"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 sm:grid-cols-3 lg:px-8">
        {c.highlights.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border p-6">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-heading font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </section>

      {/* About teaser */}
      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-medium text-primary">{c.aboutKicker}</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">{c.aboutTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">{c.aboutBody}</p>
          <Button variant="outline" className="mt-6" nativeButton={false} render={<Link href="/about" />}>
            {c.aboutCta}
          </Button>
        </div>
      </section>

      {/* Services teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-medium text-primary">{c.servicesKicker}</p>
            <h2 className="mt-2 max-w-xl font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {c.servicesTitle}
            </h2>
          </div>
          <Link href="/services" className="font-medium text-primary hover:underline">
            {c.servicesCta}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="rounded-2xl border border-border p-6 transition-shadow hover:shadow-md"
            >
              <Sparkles className="size-6 text-primary" />
              <h3 className="mt-4 font-heading font-semibold text-foreground">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-medium text-primary">{c.whyKicker}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">{c.whyTitle}</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.why.map((item, index) => {
              const Icon = whyIcons[index];
              return (
                <div key={item.title} className="rounded-xl bg-background p-6 text-center shadow-sm">
                  <Icon className="mx-auto size-7 text-primary" />
                  <h3 className="mt-3 font-heading font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-medium text-primary">{c.testimonialsKicker}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {c.testimonialsTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span className="font-heading font-bold text-foreground">{c.ratingValue}</span>
            <span className="text-sm text-muted-foreground">{c.ratingLabel}</span>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {c.reviews.map((review, index) => (
            <div key={index} className="rounded-xl border border-border p-6">
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-3 leading-relaxed text-foreground">&ldquo;{review}&rdquo;</p>
              <p className="mt-3 text-sm text-muted-foreground">{c.reviewLabel}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/30 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {c.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + Contact */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="font-medium text-primary">{c.faqKicker}</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">{c.faqTitle}</h2>
          <div className="mt-4">
            <FaqSection items={c.faq} />
          </div>
        </div>
        <div className="h-fit rounded-2xl border border-border bg-secondary/20 p-6 sm:p-8">
          <p className="font-medium text-primary">{c.contactKicker}</p>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">{c.contactBody}</p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
