import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

/** Settings > danger zone: "تفريغ سجل طلبات واتساب" (admin v2 brief, 2026-09-08). */
export async function DELETE() {
  const { response } = await requireAdmin();
  if (response) return response;

  const deleted = await getDb().delete(inquiries).returning({ id: inquiries.id });
  return Response.json({ ok: true, count: deleted.length });
}
