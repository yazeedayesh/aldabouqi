import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import {
  Armchair,
  BedDouble,
  Building2,
  Gem,
  Home,
  Plug,
  Sofa,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { FaqSection } from "@/components/sections/faq-section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL, buildWhatsAppLink } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "خدماتنا | الدابوقي لشراء الأثاث المستعمل - عمان",
    metaDescription:
      "اكتشف خدمات الدابوقي الشاملة لشراء الأثاث المستعمل في عمان: أثاث منزلي ومكتبي، أجهزة كهربائية، أنتيكات، وإفراغ منازل كامل. تقييم مجاني واحترافي في جميع المناطق.",
    keywords:
      "خدمات شراء أثاث عمان, شراء أثاث منزلي مستعمل, شراء أثاث مكتبي, شراء أجهزة كهربائية مستعملة, شراء أنتيكات عمان, إفراغ منازل عمان, تقييم أثاث مستعمل, خدمات الدابوقي",
    pageTitle: "خدماتنا",
    introKicker: "خدماتنا المتكاملة في",
    introTitle: "شراء الأثاث المستعمل بعمان",
    requestCta: "اطلب الخدمة الآن",
    statsKicker: "شركة الدابوقي الرائدة في شراء الأثاث المستعمل بعمان",
    statsBody:
      "مع خبرة طويلة في سوق الأثاث المستعمل، نقدم لعملائنا أفضل الأسعار والخدمة الاحترافية. نحن الخيار الأول والموثوق لآلاف العملاء في جميع أنحاء عمان.",
    stats: [
      { value: "10,000+", label: "عملية بيع ناجحة" },
      { value: "20,000+", label: "عميل راضٍ وسعيد" },
      { value: "60+", label: "سنة من الخبرة" },
      { value: "15+", label: "موظف متخصص" },
    ],
    faqTitle: "أسئلة شائعة عن خدماتنا",
    faq: [
      { question: "ما هي الخدمات التي تقدمها شركة الدابوقي؟", answer: "نقدم خدمات شاملة تشمل: شراء الأثاث المنزلي المستعمل، شراء الأثاث المكتبي، شراء الأجهزة الكهربائية المستعملة، شراء الأنتيكات والتحف، وخدمة إفراغ المنازل بالكامل في جميع مناطق عمان." },
      { question: "هل تشترون جميع أنواع الأثاث؟", answer: "نعم، نشتري جميع أنواع الأثاث المنزلي والمكتبي بغض النظر عن الحالة، بالإضافة إلى الأجهزة الكهربائية والأنتيكات." },
      { question: "كيف تتم عملية التقييم والشراء؟", answer: "نقوم بزيارة موقعك، معاينة الأثاث احترافياً، تقديم تقييم عادل وفوري، والدفع مباشرة نقداً بعد الاتفاق على السعر." },
      { question: "ما هي مناطق الخدمة؟", answer: "نغطي جميع مناطق عمان: غرب عمان، شرق عمان، جنوب عمان، وشمال عمان." },
    ],
    services: [
      { icon: Home, title: "شراء أثاث منزلي مستعمل", body: "نشتري جميع أنواع الأثاث المنزلي المستعمل: غرف نوم، صالونات، طاولات، كنب، خزائن وكل ما تحتاج بأفضل الأسعار في عمان", href: "/buy-used-home-furniture" as const, image: { src: "/img/service/aldabouqi1.webp", alt: "شراء أثاث منزلي مستعمل عمان" } },
      { icon: BedDouble, title: "شراء غرف نوم مستعملة", body: "نشتري غرف نوم مستعملة بجميع أنواعها: خشب، MDF، تركي، صيني بأعلى الأسعار في الأردن مع معاينة فورية ودفع نقدي", href: "/buy-used-bedrooms" as const, image: { src: "/img/service/aldabouqi2.webp", alt: "شراء غرف نوم مستعملة عمان" } },
      { icon: Building2, title: "شراء أثاث مكتبي مستعمل", body: "نشتري جميع أنواع الأثاث المكتبي: مكاتب، كراسي، خزائن ملفات، طاولات اجتماعات، ومعدات مكتبية بأسعار ممتازة", href: "/buy-used-office-furniture" as const, image: { src: "/img/service/aldabouqi3.webp", alt: "شراء أثاث مكتبي مستعمل عمان" } },
      { icon: Plug, title: "شراء أجهزة كهربائية مستعملة", body: "نشتري كافة الأجهزة الكهربائية: ثلاجات، غسالات، مكيفات، تلفزيونات، أفران وجميع الإلكترونيات المنزلية", whatsapp: "بدي أستفسر عن بيع أجهزة كهربائية مستعملة", image: { src: "/img/service/aldabouqi4.webp", alt: "شراء أجهزة كهربائية مستعملة عمان" } },
      { icon: Warehouse, title: "إفراغ منازل بالكامل", body: "خدمة شاملة لإفراغ المنازل والشقق: شراء كامل محتويات المنزل دفعة واحدة بسعر عادل وخدمة سريعة", whatsapp: "بدي أستفسر عن خدمة إفراغ منزل بالكامل", image: { src: "/img/service/aldabouqi5.webp", alt: "إفراغ منازل بالكامل عمان" } },
      { icon: Gem, title: "شراء أنتيكات وتحف", body: "نشتري القطع النادرة والأنتيكات: تحف قديمة، لوحات فنية، مشغولات تراثية وجميع المقتنيات الثمينة بتقييم دقيق", whatsapp: "بدي أستفسر عن بيع أنتيكات وتحف", image: { src: "/img/service/aldabouqi6.webp", alt: "شراء أنتيكات وتحف عمان" } },
      { icon: Sofa, title: "شراء صالونات مستعملة", body: "نشتري الصالونات والكنب المستعمل: أمريكي، تركي، محلي بجميع الأحجام والأنواع بأفضل الأسعار في السوق", whatsapp: "بدي أستفسر عن بيع صالون مستعمل", image: { src: "/img/service/aldabouqi7.webp", alt: "شراء صالونات مستعملة عمان" } },
      { icon: UtensilsCrossed, title: "شراء مطابخ مستعملة", body: "نشتري المطابخ المستعملة: خشب، ألمنيوم، فورمايكا بكافة الأحجام والتصاميم مع تقييم فوري وسعر عادل", whatsapp: "بدي أستفسر عن بيع مطبخ مستعمل" },
      { icon: Armchair, title: "شراء كنب وطقم جلوس", body: "نشتري أطقم الجلوس والكنب المستعمل: جلد، قماش، شامواه بجميع الأنواع والأحجام بأسعار منافسة جداً", whatsapp: "بدي أستفسر عن بيع طقم جلوس مستعمل" },
    ],
  },
  en: {
    metaTitle: "Our Services | Aldabouqi - Buying Used Furniture, Amman",
    metaDescription:
      "Discover Aldabouqi's complete used-furniture buying services in Amman: home and office furniture, appliances, antiques, and full house clearance. Free, professional valuation in every area.",
    keywords:
      "furniture buying services Amman, buy used home furniture, buy office furniture, buy used appliances, buy antiques Amman, house clearance Amman, used furniture valuation, Aldabouqi services",
    pageTitle: "Our Services",
    introKicker: "Our complete services in",
    introTitle: "Buy Used Furniture in Amman",
    requestCta: "Request Service Now",
    statsKicker: "Aldabouqi - Leaders in Buying Used Furniture in Amman",
    statsBody:
      "With years of experience in the used-furniture market, we offer our customers the best prices and professional service. We're the trusted first choice for thousands of customers across Amman.",
    stats: [
      { value: "10,000+", label: "Successful Sales" },
      { value: "20,000+", label: "Happy Customers" },
      { value: "60+", label: "Years of Experience" },
      { value: "15+", label: "Specialist Staff" },
    ],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { question: "What services does Aldabouqi offer?", answer: "A full range: buying used home furniture, office furniture, used appliances, antiques, and full house-clearance services across every area of Amman." },
      { question: "Do you buy all types of furniture?", answer: "Yes — we buy all types of home and office furniture regardless of condition, plus appliances and antiques." },
      { question: "How does the valuation and purchase process work?", answer: "We visit your location, professionally inspect the furniture, offer a fair, instant valuation, and pay cash immediately once we agree on a price." },
      { question: "What areas do you serve?", answer: "Every area of Amman — west, east, south, and north Amman." },
    ],
    services: [
      { icon: Home, title: "Used Home Furniture", body: "We buy all types of used home furniture: bedrooms, living rooms, tables, sofas, cabinets and everything you need, at the best prices in Amman", href: "/buy-used-home-furniture" as const, image: { src: "/img/service/aldabouqi1.webp", alt: "Used Home Furniture Amman" } },
      { icon: BedDouble, title: "Used Bedrooms", body: "We buy used bedrooms of every kind: wood, MDF, Turkish, Chinese, at the best prices in Jordan with an instant inspection and cash payment", href: "/buy-used-bedrooms" as const, image: { src: "/img/service/aldabouqi2.webp", alt: "Used Bedrooms Amman" } },
      { icon: Building2, title: "Used Office Furniture", body: "We buy all types of office furniture: desks, chairs, filing cabinets, meeting tables, and office equipment at excellent prices", href: "/buy-used-office-furniture" as const, image: { src: "/img/service/aldabouqi3.webp", alt: "Used Office Furniture Amman" } },
      { icon: Plug, title: "Used Appliances", body: "We buy all appliances: refrigerators, washing machines, air conditioners, TVs, ovens and all home electronics", whatsapp: "I'd like to ask about selling used appliances", image: { src: "/img/service/aldabouqi4.webp", alt: "Used Appliances Amman" } },
      { icon: Warehouse, title: "Full House Clearance", body: "A complete house and apartment clearance service: we buy your entire home's contents in one go, at a fair price with fast service", whatsapp: "I'd like to ask about a full house clearance", image: { src: "/img/service/aldabouqi5.webp", alt: "Full House Clearance Amman" } },
      { icon: Gem, title: "Antiques & Artifacts", body: "We buy rare pieces and antiques: old artifacts, paintings, heritage crafts and all valuables, with an accurate valuation", whatsapp: "I'd like to ask about selling antiques", image: { src: "/img/service/aldabouqi6.webp", alt: "Antiques Amman" } },
      { icon: Sofa, title: "Used Sofas", body: "We buy used sofas and living room sets: American, Turkish, local — every size and type, at the best market prices", whatsapp: "I'd like to ask about selling a used sofa", image: { src: "/img/service/aldabouqi7.webp", alt: "Used Sofas Amman" } },
      { icon: UtensilsCrossed, title: "Used Kitchens", body: "We buy used kitchens: wood, aluminum, formica — every size and design, with an instant valuation and fair price", whatsapp: "I'd like to ask about selling a used kitchen" },
      { icon: Armchair, title: "Sofas & Seating Sets", body: "We buy used sofa and seating sets: leather, fabric, suede — every type and size at very competitive prices", whatsapp: "I'd like to ask about selling a seating set" },
    ],
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/services",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/logo/aldabouqi-black.webp`,
  });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
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
          url: `${SITE_URL}${locale === "en" ? "/en" : ""}/services`,
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
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "خدمات شراء الأثاث المستعمل",
              itemListElement: c.services.map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.title, description: s.body },
              })),
            },
          },
        }}
      />
      <BreadcrumbJsonLd items={[{ name: c.pageTitle, path: "/services" }]} />
      <FaqJsonLd items={c.faq} />

      <PageHero title={c.pageTitle} crumbs={[{ href: "/services", label: c.pageTitle }]} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium text-primary">{c.introKicker}</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {c.introTitle}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.services.map((service, i) => (
            <Reveal key={service.title} delayMs={(i % 3) * 100} className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border transition-all hover:-translate-y-1 hover:shadow-md">
                {"image" in service && (
                  <div className="relative aspect-video">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex h-full flex-col p-6">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <service.icon className="size-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.body}</p>
                <Button
                  variant="link"
                  className="mt-4 h-auto justify-start p-0"
                  nativeButton={false}
                  render={
                    "href" in service ? (
                      <Link href={service.href} />
                    ) : (
                      <a
                        href={buildWhatsAppLink(service.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    )
                  }
                >
                  {c.requestCta}
                </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {c.statsKicker}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-muted-foreground">{c.statsBody}</p>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {c.stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection title={c.faqTitle} items={c.faq} />
    </>
  );
}
