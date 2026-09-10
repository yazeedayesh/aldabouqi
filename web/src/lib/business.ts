import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { businessSettings, contactNumbers } from "@/db/schema";
import { BUSINESS } from "@/lib/constants";

/**
 * Admin-editable business info (admin v2 brief, 2026-09-08) — reflected on
 * the footer and LocalBusiness schema. `cache()` de-dupes repeated calls
 * within one request (e.g. a page's own metadata + its JSON-LD both need
 * this). Falls back to the old hardcoded BUSINESS constant if the
 * singleton row is somehow missing, so a page never renders with empty
 * business info.
 */
export const getBusinessSettings = cache(async () => {
  const [row] = await getDb().select().from(businessSettings).where(eq(businessSettings.id, "default"));
  return (
    row ?? {
      id: "default",
      nameAr: BUSINESS.nameAr,
      nameEn: BUSINESS.nameEn,
      email: BUSINESS.email,
      experienceYears: "+٦٠",
      addressAr: BUSINESS.address.streetAddressAr,
      hoursAr: "٢٤ ساعة · ٧ أيام",
      updatedAt: new Date(),
    }
  );
});

export const getDefaultContactNumber = cache(async () => {
  const [row] = await getDb().select().from(contactNumbers).where(eq(contactNumbers.isDefault, true));
  return row ?? null;
});

export function buildWhatsAppLinkFor(phoneE164: string, message: string) {
  return `https://wa.me/${phoneE164.replace(/^\+/, "")}?text=${encodeURIComponent(message)}`;
}
