import { setRequestLocale } from "next-intl/server";
import { CheckCircle2, Clock, ShieldCheck, Sparkles, Users } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { FaqSection } from "@/components/sections/faq-section";
import { JsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "من نحن | شركة الدابوقي لشراء الأثاث المستعمل في عمان - خبرة وثقة منذ سنوات",
    metaDescription:
      "تعرف على شركة الدابوقي الرائدة في شراء الأثاث المستعمل بعمان. نقدم خدمات احترافية وأسعار عادلة وثقة مطلقة في التعامل. خبرة طويلة في تقييم وشراء جميع أنواع الأثاث المنزلي والمكتبي.",
    keywords:
      "من نحن الدابوقي, شركة شراء أثاث مستعمل عمان, تاريخ شركة الدابوقي, خدمات شراء الأثاث, شركة موثوقة لشراء الأثاث, رؤية ورسالة الدابوقي, قيمنا, فريق عمل محترف",
    pageTitle: "من نحن",
    intro: {
      heading: "نحن شركة الدابوقي لشراء الأثاث المستعمل في عمان",
      body: "إذا كنت تبحث عن شراء الأثاث المستعمل في عمان بأسعار تنافسية وعادلة، فأنت في المكان الصحيح. تقدم شركة الدابوقي خدمة شراء جميع أنواع الأثاث المستعمل في مختلف مناطق عمان وضواحيها، بالإضافة إلى خدمات شراء الأجهزة الكهربائية المستعملة بأسعار مغرية. نحن هنا لنجعل عملية بيع الأثاث القديم سريعة وآمنة.",
    },
    mission: {
      title: "مهمتنا",
      body: "مهمتنا في شركة الدابوقي هي تقديم خدمة شراء الأثاث المستعمل بأعلى مستوى من الجودة والاحترافية. نحن نسعى لتوفير أفضل الأسعار لعملائنا من خلال تقييم دقيق وعادل للأثاث المستعمل، مع تقديم خدمات سريعة وموثوقة في جميع أنحاء عمان والمناطق المجاورة.",
    },
    vision: {
      title: "رؤيتنا",
      body: "رؤيتنا في شركة الدابوقي هي أن نكون الرائدين في شراء الأثاث المستعمل في الأردن، وأن نقدم حلولًا مبتكرة تساهم في تحسين بيئة الأثاث المستعمل، مع الالتزام بالاستدامة.",
    },
    valuesTitle: "قيمنا",
    values: [
      { title: "الجودة", body: "نلتزم بتقديم خدمات ذات جودة عالية في كل جوانب عملنا" },
      { title: "الاحترافية", body: "نعمل بحرفية ومصداقية لضمان أفضل تجربة للعملاء" },
      { title: "الشفافية", body: "نؤمن بأهمية التعامل بشفافية كاملة في كل عملية بيع وشراء" },
      { title: "الاستدامة", body: "نحن نساهم في الحفاظ على البيئة من خلال إعادة استخدام الأثاث المستعمل بشكل مسؤول" },
    ],
    whyTitle: "لماذا يختارنا العملاء لشراء الأثاث المستعمل في عمان؟",
    whyIntro:
      "بخبرة طويلة وشغف في تقديم أفضل الخدمات، شركة الدابوقي هي خيارك الأمثل لبيع الأثاث المستعمل بأفضل الأسعار. نحن متخصصون في تقييم وشراء جميع أنواع الأثاث المنزلي والمكتبي في كافة مناطق عمان بمصداقية واحترافية عالية.",
    features: [
      { title: "استجابة فورية وسريعة", body: "نقدم تقييماً مجانياً لأثاثك خلال دقائق عبر الهاتف أو الزيارة المنزلية. فريقنا جاهز للرد على استفساراتك وتقديم أفضل عرض سعر." },
      { title: "أسعار عادلة ومنافسة", body: "نضمن لك الحصول على أفضل سعر لأثاثك المستعمل في السوق الأردني، مع الدفع الفوري نقداً." },
      { title: "فريق عمل محترف ومتخصص", body: "خبراء في تقييم وشراء الأثاث المستعمل بجميع أنواعه - غرف نوم، صالونات، مطابخ، أجهزة كهربائية، وأنتيكات." },
      { title: "خدمة متواصلة يومياً", body: "نحن في خدمتك من الساعة 8 صباحاً حتى 8 مساءً طوال أيام الأسبوع في جميع مناطق عمان." },
    ],
    faqTitle: "أسئلة شائعة",
    faq: [
      { question: "ما هي خدمات شركة الدابوقي؟", answer: "نقدم خدمات شراء جميع أنواع الأثاث المستعمل، الأجهزة الكهربائية، الأنتيكات، وإفراغ المنازل بالكامل في جميع مناطق عمان." },
      { question: "لماذا نختار شركة الدابوقي؟", answer: "نتميز بالخبرة الطويلة، الأسعار العادلة والتنافسية، التقييم الاحترافي، الدفع الفوري، والثقة المطلقة في التعامل مع عملائنا." },
      { question: "ما هي مناطق خدمة الدابوقي؟", answer: "نغطي جميع مناطق عمان بما في ذلك غرب عمان، شرق عمان، جنوب عمان، وشمال عمان." },
    ],
  },
  en: {
    metaTitle: "About Us | Aldabouqi - Buying Used Furniture in Amman, Trusted for Years",
    metaDescription:
      "Get to know Aldabouqi, the leading used-furniture buyer in Amman. We offer professional service, fair prices, and complete trust. Years of experience valuing and buying all types of home and office furniture.",
    keywords:
      "about Aldabouqi, used furniture buying company Amman, Aldabouqi history, furniture buying services, trusted furniture buyer, Aldabouqi vision and mission, our values, professional team",
    pageTitle: "About Us",
    intro: {
      heading: "We are Aldabouqi, buyers of used furniture in Amman",
      body: "If you're looking to sell used furniture in Amman at competitive, fair prices, you're in the right place. Aldabouqi buys all types of used furniture across Amman and its suburbs, plus used appliances at attractive prices. We're here to make selling old furniture fast and secure.",
    },
    mission: {
      title: "Our Mission",
      body: "Our mission at Aldabouqi is to deliver a used-furniture buying service with the highest level of quality and professionalism, through an accurate, fair valuation and fast, reliable service across Amman and surrounding areas.",
    },
    vision: {
      title: "Our Vision",
      body: "Our vision is to be the leader in buying used furniture in Jordan, offering innovative solutions that improve the used-furniture ecosystem while committing to sustainability.",
    },
    valuesTitle: "Our Values",
    values: [
      { title: "Quality", body: "We're committed to high-quality service in every aspect of our work" },
      { title: "Professionalism", body: "We work with integrity and credibility to ensure the best customer experience" },
      { title: "Transparency", body: "We believe in complete transparency in every buying and selling transaction" },
      { title: "Sustainability", body: "We help protect the environment by responsibly reusing used furniture" },
    ],
    whyTitle: "Why customers choose us to buy their used furniture in Amman",
    whyIntro:
      "With years of experience and a passion for great service, Aldabouqi is your best choice for selling used furniture at the best prices, across every area of Amman.",
    features: [
      { title: "Instant, fast response", body: "A free valuation within minutes, over the phone or with a home visit. Our team is ready to offer the best price." },
      { title: "Fair, competitive prices", body: "The best price for your used furniture in the Jordanian market, with instant cash payment." },
      { title: "A professional, specialized team", body: "Experts in valuing and buying bedrooms, living rooms, kitchens, appliances, and antiques." },
      { title: "Daily, continuous service", body: "At your service from 8 AM to 8 PM, every day of the week, anywhere in Amman." },
    ],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { question: "What services does Aldabouqi offer?", answer: "We buy all types of used furniture, appliances, antiques, and offer full home-clearance services across every area of Amman." },
      { question: "Why choose Aldabouqi?", answer: "Years of experience, fair and competitive prices, professional valuation, instant payment, and complete trust in every deal." },
      { question: "What areas does Aldabouqi serve?", answer: "We cover every area of Amman — west, east, south, and north Amman." },
    ],
  },
} as const;

const featureIcons = [Clock, ShieldCheck, Users, Sparkles];

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/about",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/logo/aldabouqi-logo.webp`,
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: `${c.pageTitle} - ${BUSINESS.nameAr}`,
          description: c.metaDescription,
          url: `${SITE_URL}${locale === "en" ? "/en" : ""}/about`,
          mainEntity: {
            "@type": "Organization",
            name: BUSINESS.nameAr,
            legalName: BUSINESS.nameAr,
            url: SITE_URL,
            logo: `${SITE_URL}/img/logo/aldabouqi-logo.webp`,
            image: `${SITE_URL}/img/logo/aldabouqi-logo.webp`,
            description: c.intro.body,
            foundingDate: "2015",
            telephone: BUSINESS.phoneE164,
            email: BUSINESS.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: BUSINESS.address.streetAddressAr,
              addressLocality: BUSINESS.address.localityAr,
              addressRegion: BUSINESS.address.localityAr,
              postalCode: BUSINESS.address.postalCode,
              addressCountry: BUSINESS.address.countryCode,
            },
            geo: { "@type": "GeoCoordinates", latitude: BUSINESS.geo.latitude, longitude: BUSINESS.geo.longitude },
            areaServed: { "@type": "City", name: BUSINESS.address.localityAr, sameAs: "https://ar.wikipedia.org/wiki/عمان" },
            sameAs: [BUSINESS.social.facebook, BUSINESS.social.twitter, BUSINESS.social.instagram],
            slogan: "شريكك الموثوق في شراء الأثاث المستعمل",
            knowsAbout: ["شراء الأثاث المستعمل", "تقييم الأثاث", "شراء الأجهزة الكهربائية المستعملة", "شراء الأنتيكات", "إفراغ المنازل"],
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "08:00",
              closes: "20:00",
            },
          },
        }}
      />
      <BreadcrumbJsonLd items={[{ name: c.pageTitle, path: "/about" }]} />
      <FaqJsonLd items={c.faq.map((f) => ({ question: f.question, answer: f.answer }))} />

      <PageHero title={c.pageTitle} crumbs={[{ href: "/about", label: c.pageTitle }]} />

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{c.intro.heading}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">{c.intro.body}</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 sm:grid-cols-2 lg:px-8">
        <div className="rounded-2xl border border-border p-8">
          <h3 className="font-heading text-xl font-bold text-foreground">{c.mission.title}</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{c.mission.body}</p>
        </div>
        <div className="rounded-2xl border border-border p-8">
          <h3 className="font-heading text-xl font-bold text-foreground">{c.vision.title}</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{c.vision.body}</p>
        </div>
      </section>

      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {c.valuesTitle}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.values.map((value) => (
              <div key={value.title} className="rounded-xl bg-background p-6 text-center shadow-sm">
                <CheckCircle2 className="mx-auto size-8 text-primary" />
                <h3 className="mt-3 font-heading font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{c.whyTitle}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{c.whyIntro}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {c.features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div key={feature.title} className="flex gap-4 rounded-xl border border-border p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FaqSection title={c.faqTitle} items={c.faq} />
    </>
  );
}
