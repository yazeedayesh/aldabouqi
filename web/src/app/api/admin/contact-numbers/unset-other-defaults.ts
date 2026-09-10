import { eq } from "drizzle-orm";
import type { getDb } from "@/db";
import { contactNumbers } from "@/db/schema";

/** "Exactly one default" is enforced here rather than a DB constraint (see
 * schema.ts comment on contactNumbers.isDefault) — call this before
 * inserting/updating a row with isDefault: true. */
export async function unsetOtherDefaults(db: ReturnType<typeof getDb>, exceptId?: string) {
  const rows = await db.select({ id: contactNumbers.id }).from(contactNumbers).where(eq(contactNumbers.isDefault, true));
  for (const row of rows) {
    if (row.id === exceptId) continue;
    await db.update(contactNumbers).set({ isDefault: false }).where(eq(contactNumbers.id, row.id));
  }
}
