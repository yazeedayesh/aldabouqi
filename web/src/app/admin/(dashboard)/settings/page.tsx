import { asc, count, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { adminSessions, adminUsers, businessSettings, contactNumbers, inquiries, products } from "@/db/schema";
import { AdminPageHeader } from "../admin-page-header";
import { ContactNumbersSection } from "./contact-numbers-section";
import { BusinessInfoSection } from "./business-info-section";
import { AccountSection } from "./account-section";
import { DangerZoneSection } from "./danger-zone-section";

export default async function AdminSettingsPage() {
  const db = getDb();
  const session = await auth();

  const [numbers, [settings], [adminUser], [{ value: sessionCount }], [{ value: hiddenCount }], [{ value: inquiryCount }]] =
    await Promise.all([
      db.select().from(contactNumbers).orderBy(asc(contactNumbers.sortOrder)),
      db.select().from(businessSettings).where(eq(businessSettings.id, "default")),
      db.select().from(adminUsers).where(eq(adminUsers.id, "admin")),
      db.select({ value: count() }).from(adminSessions).where(eq(adminSessions.revoked, false)),
      db.select({ value: count() }).from(products).where(eq(products.visibility, "hidden")),
      db.select({ value: count() }).from(inquiries),
    ]);

  return (
    <div>
      <AdminPageHeader title="الإعدادات" subtitle="الحساب · أرقام التواصل · معلومات النشاط" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-4">
          <ContactNumbersSection numbers={numbers} />
          {settings && <BusinessInfoSection settings={settings} />}
        </div>
        <div className="space-y-4">
          <AccountSection username={adminUser?.username ?? session?.user?.name ?? "—"} sessionCount={sessionCount} />
          <DangerZoneSection hiddenCount={hiddenCount} inquiryCount={inquiryCount} />
        </div>
      </div>
    </div>
  );
}
