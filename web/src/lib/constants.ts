// Single source of truth for business info, tracking IDs, and NAP data.
// Extracted verbatim from the current site's index.html JSON-LD (§0/§6 of the
// migration plan) — do not change these values without updating the live
// business info first.

export const SITE_URL = "https://www.aldabouqi.com";

export const BUSINESS = {
  nameAr: "شركة الدابوقي لشراء الأثاث المستعمل",
  nameEn: "Aldabouqi Used Furniture Buying Company",
  phoneDisplay: "+962 79 698 3994",
  phoneE164: "+962796983994",
  // The live site's visible contact text has a typo ("aldabouq@outlook.com")
  // that doesn't match its own mailto href / JSON-LD ("aldabouqi@outlook.com").
  // Using the correct address everywhere here fixes that inconsistency.
  email: "aldabouqi@outlook.com",
  whatsappNumber: "962796983994", // no leading + for wa.me links
  address: {
    streetAddressAr: "جميع مناطق عمان",
    localityAr: "عمان",
    postalCode: "11953",
    countryCode: "JO",
  },
  geo: {
    latitude: 31.9454,
    longitude: 35.9284,
  },
  social: {
    facebook: "https://www.facebook.com/aldabouqi/",
    twitter: "https://x.com/aldabouqi_store",
    instagram: "https://www.instagram.com/aldabouqi.used/",
  },
} as const;

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const ANALYTICS = {
  ga4MeasurementId: "G-9FH7PMRW14",
  metaPixelId: "2346895512405626",
} as const;
