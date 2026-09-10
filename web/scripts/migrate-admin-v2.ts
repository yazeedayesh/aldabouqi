// One-time data migration for the admin v2 rebuild (site owner brief,
// 2026-09-08): seeds the new contact_numbers, business_settings, and
// admin_users tables from the values that used to be hardcoded constants
// or Vercel env vars, and reclassifies any existing "draft" product into
// the new two-axis (visibility × status) model. Safe to re-run — every
// step is guarded by an existence/value check before writing.
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { adminUsers, businessSettings, contactNumbers, products } from "../src/db/schema";
import { BUSINESS, STORE_PHONE_DISPLAY, STORE_PHONE_E164 } from "../src/lib/constants";

async function main() {
  const db = getDb();

  // 1. Contact numbers — the site-wide default (BUSINESS.phoneE164) and the
  // separate store number (STORE_PHONE_E164) from the earlier phone-scoping
  // brief, unified into one admin-managed list (site owner decision,
  // 2026-09-08: "وحّد كل شي بنظام أرقام التواصل الجديد").
  const existingNumbers = await db.select().from(contactNumbers);
  if (existingNumbers.length === 0) {
    await db.insert(contactNumbers).values([
      {
        label: "الرقم الرئيسي",
        phoneE164: BUSINESS.phoneE164,
        supportsWhatsapp: true,
        supportsCall: true,
        isDefault: true,
        sortOrder: 0,
      },
      {
        label: "رقم المتجر",
        phoneE164: STORE_PHONE_E164,
        supportsWhatsapp: true,
        supportsCall: true,
        isDefault: false,
        sortOrder: 1,
      },
    ]);
    console.log(`Seeded 2 contact numbers (default: ${BUSINESS.phoneDisplay}, store: ${STORE_PHONE_DISPLAY}).`);
  } else {
    console.log(`Skipped contact_numbers seed — ${existingNumbers.length} row(s) already present.`);
  }

  // 2. Business settings singleton — literal values from the approved
  // admin-4-settings.html mockup (address/hours weren't tracked anywhere
  // before this).
  const [existingSettings] = await db.select().from(businessSettings).where(eq(businessSettings.id, "default"));
  if (!existingSettings) {
    await db.insert(businessSettings).values({
      id: "default",
      nameAr: BUSINESS.nameAr,
      nameEn: BUSINESS.nameEn,
      email: BUSINESS.email,
      experienceYears: "+٦٠",
      addressAr: "خلدا · دابوق · تلاع العلي، عمّان",
      hoursAr: "٢٤ ساعة · ٧ أيام",
    });
    console.log("Seeded business_settings singleton row.");
  } else {
    console.log("Skipped business_settings seed — row already present.");
  }

  // 3. Admin user — migrated from ADMIN_USERNAME/ADMIN_PASSWORD_HASH so
  // login keeps working with the exact same credentials after this
  // deploy, with no action required from the site owner.
  const [existingAdmin] = await db.select().from(adminUsers).where(eq(adminUsers.id, "admin"));
  if (!existingAdmin) {
    const username = process.env.ADMIN_USERNAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!username || !passwordHash) {
      console.error("Missing ADMIN_USERNAME/ADMIN_PASSWORD_HASH — cannot seed admin_users. Run this again with those env vars set.");
      process.exitCode = 1;
    } else {
      await db.insert(adminUsers).values({ id: "admin", username, passwordHash });
      console.log(`Seeded admin_users row for username "${username}".`);
    }
  } else {
    console.log("Skipped admin_users seed — row already present.");
  }

  // 4. Reclassify existing "draft" products into the new model: visibility
  // becomes 'draft', status reverts to the availability-only default.
  const draftProducts = await db.select({ id: products.id }).from(products).where(eq(products.status, "draft"));
  for (const row of draftProducts) {
    await db.update(products).set({ status: "available", visibility: "draft" }).where(eq(products.id, row.id));
  }
  console.log(`Reclassified ${draftProducts.length} legacy "draft"-status product(s) into visibility='draft'.`);
}

main();
