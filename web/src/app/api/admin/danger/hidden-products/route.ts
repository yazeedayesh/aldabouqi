import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

/** Settings > danger zone: "حذف كل المنتجات المخفية" (admin v2 brief, 2026-09-08). */
export async function DELETE() {
  const { response } = await requireAdmin();
  if (response) return response;

  const deleted = await getDb().delete(products).where(eq(products.visibility, "hidden")).returning({ id: products.id });
  return Response.json({ ok: true, count: deleted.length });
}
