import { setRequestLocale } from "next-intl/server";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { FaqSection } from "@/components/sections/faq-section";
import { Button } from "@/components/ui/button";
import { JsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "شريكنا معرض عايش | شركة الدابوقي لشراء الأثاث المستعمل في عمان",
    metaDescription:
      "معرض عايش شريك الدابوقي الموثوق - نقدم خدمة شراء الأثاث المستعمل بالتعاون مع معرض عايش في عمان. أسعار تنافسية، تقييم فوري، ودفع نقدي. اتصل الآن للاستفسار.",
    keywords:
      "خدمات شراء أثاث عمان, شراء أثاث منزلي مستعمل, شراء أثاث مكتبي, شراء أجهزة كهربائية مستعملة, شراء أنتيكات عمان, إفراغ منازل عمان, تقييم أثاث مستعمل, خدمات عايش",
    pageTitle: "معرض عايش لشراء الأثاث المستعمل",
    location: "عمان - الأردن",
    callCta: "اتصل بنا الآن",
    servicesTitle: "خدماتنا",
    services: [
      "شراء جميع أنواع الأثاث المستعمل بأفضل الأسعار",
      "تقييم مجاني للأثاث داخل المنزل",
      "شراء غرف نوم ومجالس ومطابخ مستعملة",
    ],
    aboutTitle: "من نحن",
    about:
      "يُعد معرض عايش لشراء الأثاث المستعمل من الجهات المتخصصة في شراء الأثاث المستعمل في الأردن، حيث نقدم خدمات احترافية وسريعة لكل من يرغب ببيع أثاثه بأفضل سعر ممكن. نمتلك خبرة واسعة في تقييم الأثاث ومعرفة قيمته الحقيقية، مما يضمن للعملاء عروض أسعار عادلة وفورية دون تأخير. نهدف إلى تسهيل عملية بيع الأثاث بالكامل بدءاً من المعاينة المجانية وحتى النقل، مع الالتزام بالمصداقية والاحترافية في جميع مراحل العمل.",
    faqTitle: "أسئلة شائعة",
    faq: [
      { question: "ما هي الخدمات التي تقدمها معرض عايش؟", answer: "نقدم خدمات شاملة تشمل: شراء الأثاث المنزلي المستعمل، شراء الأثاث المكتبي، شراء الأجهزة الكهربائية المستعملة، شراء الأنتيكات والتحف، وخدمة إفراغ المنازل بالكامل في جميع مناطق عمان." },
      { question: "هل تشترون جميع أنواع الأثاث؟", answer: "نعم، نشتري جميع أنواع الأثاث المنزلي والمكتبي بغض النظر عن الحالة، بالإضافة إلى الأجهزة الكهربائية والأنتيكات." },
      { question: "كيف تتم عملية التقييم والشراء؟", answer: "نقوم بزيارة موقعك، معاينة الأثاث احترافياً، تقديم تقييم عادل وفوري، والدفع مباشرة نقداً بعد الاتفاق على السعر." },
      { question: "ما هي مناطق الخدمة؟", answer: "نغطي جميع مناطق عمان: غرب عمان، شرق عمان، جنوب عمان، وشمال عمان." },
    ],
  },
  en: {
    metaTitle: "Our Partner Ayesh Showroom | Aldabouqi - Buying Used Furniture in Amman",
    metaDescription:
      "Ayesh Showroom, Aldabouqi's trusted partner - we buy used furniture in partnership with Ayesh Showroom in Amman. Competitive prices, instant valuation, and cash payment. Call now to inquire.",
    keywords:
      "furniture buying services Amman, buy used home furniture, buy office furniture, buy used appliances, buy antiques Amman, house clearance Amman, used furniture valuation, Ayesh services",
    pageTitle: "Ayesh Showroom for Buying Used Furniture",
    location: "Amman, Jordan",
    callCta: "Call Us Now",
    servicesTitle: "Services",
    services: [
      "Buying all types of used furniture at the best prices",
      "Free in-home furniture valuation",
      "Buying used bedrooms, living rooms, and kitchens",
    ],
    aboutTitle: "About Us",
    about:
      "Ayesh Showroom for buying used furniture is a specialist in the used-furniture business in Jordan, offering fast, professional service to anyone who wants to sell their furniture for the best possible price. We have extensive experience valuing furniture and understanding its real worth, ensuring customers get fair, instant price offers without delay. Our goal is to make the entire furniture-selling process easy, from the free inspection through to pickup, while maintaining credibility and professionalism at every stage.",
    faqTitle: "Frequently Asked Questions",
    faq: [
      { question: "What services does Ayesh Showroom offer?", answer: "A full range: buying used home furniture, office furniture, used appliances, antiques, and full house-clearance services across every area of Amman." },
      { question: "Do you buy all types of furniture?", answer: "Yes — we buy all types of home and office furniture regardless of condition, plus appliances and antiques." },
      { question: "How does the valuation and purchase process work?", answer: "We visit your location, professionally inspect the furniture, offer a fair, instant valuation, and pay cash immediately once we agree on a price." },
      { question: "What areas do you serve?", answer: "Every area of Amman — west, east, south, and north Amman." },
    ],
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/partner">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/partner",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/logo/aldabouqi-black.webp`,
  });
}

export default async function PartnerPage({ params }: PageProps<"/[locale]/partner">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${c.pageTitle} - ${BUSINESS.nameAr}`,
          description: c.metaDescription,
          url: `${SITE_URL}${locale === "en" ? "/en" : ""}/partner`,
          mainEntity: {
            "@type": "LocalBusiness",
            name: BUSINESS.nameAr,
            image: `${SITE_URL}/img/logo/aldabouqi.webp`,
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
            url: SITE_URL,
            priceRange: "$$",
            areaServed: { "@type": "City", name: BUSINESS.address.localityAr },
          },
        }}
      />
      <BreadcrumbJsonLd items={[{ name: locale === "en" ? "Our Partner" : "شريكنا", path: "/partner" }]} />
      <FaqJsonLd items={c.faq} />

      <PageHero title={c.pageTitle} crumbs={[{ href: "/partner", label: locale === "en" ? "Our Partner" : "شريكنا" }]} />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3">
            <MapPin className="size-5 text-primary" />
            <span className="text-muted-foreground">{c.location}</span>
          </div>
          <Button
            nativeButton={false}
            render={<a href={`tel:${BUSINESS.phoneE164}`} />}
          >
            <Phone className="size-4" />
            {c.callCta}
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="font-heading text-xl font-bold text-foreground">{c.servicesTitle}</h2>
          <ul className="mt-4 space-y-3">
            {c.services.map((service) => (
              <li key={service} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{service}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="font-heading text-xl font-bold text-foreground">{c.aboutTitle}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{c.about}</p>
        </div>
      </section>

      <FaqSection title={c.faqTitle} items={c.faq} />
    </>
  );
}
