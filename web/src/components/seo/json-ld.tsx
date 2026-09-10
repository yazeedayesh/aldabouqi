import { BUSINESS, SITE_URL } from "@/lib/constants";
import { getBusinessSettings, getDefaultContactNumber } from "@/lib/business";

/**
 * Typed JSON-LD helpers mirroring the current site's structured data
 * exactly (extracted from index.html / buy-used-furniture-*.html), so
 * ported pages keep the same schema.org markup verbatim. Each component
 * renders a single <script type="application/ld+json"> tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const defaultGeo = {
  "@type": "GeoCoordinates",
  latitude: BUSINESS.geo.latitude,
  longitude: BUSINESS.geo.longitude,
};

/** Standalone LocalBusiness block — homepage, about, contact. Async: reads
 * the admin-editable business_settings row + default contact number
 * (admin v2 brief, 2026-09-08 — "تنعكس على... الـschema"). */
export async function LocalBusinessJsonLd({
  description,
  image = `${SITE_URL}/img/logo/aldabouqi.webp`,
  openingHours = { opens: "00:00", closes: "23:59" },
  aggregateRating,
}: {
  description: string;
  image?: string;
  openingHours?: { opens: string; closes: string };
  aggregateRating?: { ratingValue: string; reviewCount: string };
}) {
  const [settings, defaultNumber] = await Promise.all([getBusinessSettings(), getDefaultContactNumber()]);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: settings.nameAr,
        image,
        "@id": SITE_URL,
        url: SITE_URL,
        telephone: defaultNumber?.phoneE164 ?? BUSINESS.phoneE164,
        email: settings.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.addressAr,
          addressLocality: BUSINESS.address.localityAr,
          addressRegion: BUSINESS.address.localityAr,
          postalCode: BUSINESS.address.postalCode,
          addressCountry: BUSINESS.address.countryCode,
        },
        geo: defaultGeo,
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          ...openingHours,
        },
        sameAs: [BUSINESS.social.facebook, BUSINESS.social.twitter, BUSINESS.social.instagram],
        priceRange: "$$",
        ...(aggregateRating
          ? { aggregateRating: { "@type": "AggregateRating", ...aggregateRating } }
          : {}),
        areaServed: { "@type": "City", name: BUSINESS.address.localityAr },
        description,
      }}
    />
  );
}

/**
 * Service block wrapping LocalBusiness as `provider` — used on services.html
 * and every buy-used-furniture-[area] page.
 */
export async function ServiceJsonLd({
  serviceType,
  name,
  description,
  areaServedName,
  offerDescription,
  openingHours = { opens: "08:00", closes: "20:00" },
}: {
  serviceType: string;
  name: string;
  description: string;
  areaServedName: string;
  offerDescription: string;
  openingHours?: { opens: string; closes: string };
}) {
  const [settings, defaultNumber] = await Promise.all([getBusinessSettings(), getDefaultContactNumber()]);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType,
        name,
        description,
        provider: {
          "@type": "LocalBusiness",
          name: settings.nameAr,
          image: `${SITE_URL}/img/logo/aldabouqi.webp`,
          telephone: defaultNumber?.phoneE164 ?? BUSINESS.phoneE164,
          email: settings.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.addressAr,
            addressLocality: BUSINESS.address.localityAr,
            addressRegion: BUSINESS.address.localityAr,
            postalCode: BUSINESS.address.postalCode,
            addressCountry: BUSINESS.address.countryCode,
          },
          geo: defaultGeo,
          url: SITE_URL,
          priceRange: "$$",
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            ...openingHours,
          },
        },
        areaServed: { "@type": "Place", name: areaServedName },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          price: "0",
          priceCurrency: "JOD",
          description: offerDescription,
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: ReadonlyArray<{ name: string; path: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd({
  items,
}: {
  items: ReadonlyArray<{ question: string; answer: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

const availabilityBySchemaStatus = {
  available: "https://schema.org/InStock",
  reserved: "https://schema.org/Reserved",
  sold: "https://schema.org/SoldOut",
  // Draft products 404 before rendering; included only so callers can pass
  // Product["status"] straight through without a cast.
  draft: "https://schema.org/OutOfStock",
} as const;

/** New — the current site has no store, so there's no prior markup to mirror. */
export function ProductJsonLd({
  name,
  description,
  images,
  price,
  status,
  path,
}: {
  name: string;
  description: string;
  images: string[];
  price: number | null;
  status: keyof typeof availabilityBySchemaStatus;
  path: string;
}) {
  const url = `${SITE_URL}${path}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        ...(images.length > 0 ? { image: images } : {}),
        url,
        // Aldabouqi sells only used furniture — never NewCondition.
        itemCondition: "https://schema.org/UsedCondition",
        ...(price != null
          ? {
              offers: {
                "@type": "Offer",
                url,
                price,
                priceCurrency: "JOD",
                availability: availabilityBySchemaStatus[status],
              },
            }
          : {}),
      }}
    />
  );
}

export function HowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: ReadonlyArray<{ name: string; text: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name,
        description,
        step: steps.map((step, index) => ({
          "@type": "HowToStep",
          name: step.name,
          text: step.text,
          position: index + 1,
        })),
      }}
    />
  );
}
