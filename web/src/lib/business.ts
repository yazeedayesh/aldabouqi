import { cache } from "react";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { businessSettings, contactNumbers } from "@/db/schema";
import { BUSINESS } from "@/lib/constants";

const REVALIDATE_SECONDS = 3600;

/**
 * Both read on every single page via Header/Footer — cached cross-request
 * (unstable_cache) so that DB query doesn't run per visitor, with React's
 * cache() layered on top to de-dupe the handful of calls within one request
 * (e.g. a page's own metadata + its JSON-LD both need this).
 */
const fetchBusinessSettings = unstable_cache(
  async () => {
    const [row] = await getDb().select().from(businessSettings).where(eq(businessSettings.id, "default"));
    return row ?? null;
  },
  ["business-settings"],
  { revalidate: REVALIDATE_SECONDS, tags: ["business"] }
);

/**
 * Admin-editable business info (admin v2 brief, 2026-09-08) — reflected on
 * the footer and LocalBusiness schema. Falls back to the old hardcoded
 * BUSINESS constant if the singleton row is somehow missing, so a page
 * never renders with empty business info.
 */
const FALLBACK_SETTINGS = {
  id: "default",
  nameAr: BUSINESS.nameAr,
  nameEn: BUSINESS.nameEn,
  email: BUSINESS.email,
  experienceYears: "+٦٠",
  addressAr: BUSINESS.address.streetAddressAr,
  hoursAr: "٢٤ ساعة · ٧ أيام",
  updatedAt: new Date(),
};

// Rendered on every page via the footer (and the homepage's LocalBusiness
// JSON-LD) — a DB outage with a cold cache must never take the whole site
// down just for this, so a thrown error falls back exactly like a missing
// row does.
export const getBusinessSettings = cache(async () => {
  const row = await fetchBusinessSettings().catch(() => null);
  return row ?? FALLBACK_SETTINGS;
});

export const getCachedContactNumbers = unstable_cache(
  async () => getDb().select().from(contactNumbers),
  ["contact-numbers"],
  { revalidate: REVALIDATE_SECONDS, tags: ["contact-numbers", "business"] }
);

export const getDefaultContactNumber = cache(async () => {
  const rows = await getCachedContactNumbers().catch(() => []);
  return rows.find((r) => r.isDefault) ?? null;
});

export function buildWhatsAppLinkFor(phoneE164: string, message: string) {
  return `https://wa.me/${phoneE164.replace(/^\+/, "")}?text=${encodeURIComponent(message)}`;
}
