import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminSessions } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const rows = await getDb()
    .select()
    .from(adminSessions)
    .where(eq(adminSessions.revoked, false))
    .orderBy(desc(adminSessions.lastSeenAt));

  return Response.json(rows);
}

/** "Sign out of all devices" (admin v2 brief, 2026-09-08) — revokes every
 * open session, including the one making this request. The auth.ts jwt
 * callback checks admin_sessions.revoked on every request, so this takes
 * effect the moment each device's browser makes its next request. */
export async function POST() {
  const { response } = await requireAdmin();
  if (response) return response;

  await getDb()
    .update(adminSessions)
    .set({ revoked: true })
    .where(and(eq(adminSessions.revoked, false)));

  return Response.json({ ok: true });
}
