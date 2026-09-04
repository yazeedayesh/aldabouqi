import { Mail, MapPin, Phone } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { JsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "تواصل معنا | شركة الدابوقي لشراء الأثاث المستعمل في عمان",
    metaDescription:
      "تواصل مع شركة الدابوقي لشراء الأثاث المستعمل في عمان. اتصل بنا على 0796983994 أو أرسل رسالة للحصول على تقييم مجاني وسريع لأثاثك. نخدم جميع مناطق عمان.",
    keywords:
      "تواصل شركة الدابوقي, رقم شراء أثاث مستعمل عمان, بيع أثاث مستعمل, تقييم أثاث مجاني, موقع شركة الدابوقي, اتصل بنا",
    pageTitle: "معلومات الاتصال",
    breadcrumbLabel: "اتصل بنا",
    infoTitle: "معلومات الاتصال",
    phoneLabel: "رقم الهاتف",
    phoneHint: "يمكنكم الاتصال بنا في أي وقت",
    emailLabel: "البريد الإلكتروني",
    emailHint: "يمكنكم التواصل معنا عبر البريد الإلكتروني",
    areaLabel: "أماكن يمكننا زيارتها",
    areaHint: "تغطية كاملة لجميع مناطق عمان وضواحيها",
    formTitle: "تواصل معنا!",
    formSubtitle:
      "انطلاقاً من شغفنا بالدقة والتزامنا بالجودة، كنا ومازلنا نوفر لكم جميع سبل التواصل معنا.",
  },
  en: {
    metaTitle: "Contact Us | Aldabouqi - Buying Used Furniture in Amman",
    metaDescription:
      "Get in touch with Aldabouqi, buyers of used furniture in Amman. Call us at 0796983994 or send a message for a fast, free valuation of your furniture. We serve every area of Amman.",
    keywords:
      "contact Aldabouqi, used furniture buyer number Amman, sell used furniture, free furniture valuation, Aldabouqi location, contact us",
    pageTitle: "Contact Information",
    breadcrumbLabel: "Contact Us",
    infoTitle: "Contact Information",
    phoneLabel: "Phone Number",
    phoneHint: "You can call us anytime",
    emailLabel: "Email",
    emailHint: "You can reach us by email",
    areaLabel: "Areas we can visit",
    areaHint: "Full coverage across all Amman areas and suburbs",
    formTitle: "Get in Touch!",
    formSubtitle:
      "Driven by our passion for precision and commitment to quality, we've always made it easy for you to reach us.",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    path: "/contact",
    locale: locale as Locale,
    ogImage: `${SITE_URL}/img/logo/aldabouqi-logo.webp`,
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  const infoItems = [
    { icon: Phone, label: c.phoneLabel, hint: c.phoneHint, value: BUSINESS.phoneDisplay, href: `tel:${BUSINESS.phoneE164}` },
    { icon: Mail, label: c.emailLabel, hint: c.emailHint, value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
    { icon: MapPin, label: c.areaLabel, hint: c.areaHint, value: null, href: null },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `${c.pageTitle} - ${BUSINESS.nameAr}`,
          description: c.metaDescription,
          url: `${SITE_URL}${locale === "en" ? "/en" : ""}/contact`,
          mainEntity: {
            "@type": "LocalBusiness",
            name: BUSINESS.nameAr,
            image: `${SITE_URL}/img/logo/aldabouqi.webp`,
            "@id": SITE_URL,
            url: SITE_URL,
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
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "08:00",
              closes: "20:00",
            },
            sameAs: [BUSINESS.social.facebook, BUSINESS.social.twitter, BUSINESS.social.instagram],
            areaServed: { "@type": "City", name: BUSINESS.address.localityAr },
          },
        }}
      />
      <BreadcrumbJsonLd items={[{ name: c.breadcrumbLabel, path: "/contact" }]} />

      <PageHero title={c.pageTitle} crumbs={[{ href: "/contact", label: c.breadcrumbLabel }]} />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="space-y-6 lg:col-span-2">
          <h2 className="font-heading text-2xl font-bold text-foreground">{c.infoTitle}</h2>
          {infoItems.map((item) => (
            <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground">{item.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.hint}</p>
                {item.value && item.href ? (
                  <a href={item.href} dir="ltr" className="mt-1 inline-block text-sm font-medium text-primary hover:underline">
                    {item.value}
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-secondary/20 p-6 sm:p-8 lg:col-span-3">
          <h2 className="font-heading text-2xl font-bold text-foreground">{c.formTitle}</h2>
          <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">{c.formSubtitle}</p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
