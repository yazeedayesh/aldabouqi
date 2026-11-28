import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

/** Settings > danger zone: "حذف كل المنتجات المخفية" (admin v2 brief, 2026-09-08). */
export async function DELETE() {
  const { response } = await requireAdmin();
  if (response) return response;

  const deleted = await getDb().delete(products).where(eq(products.visibility, "hidden")).returning({ id: products.id });
  revalidatePath("/", "layout");
  revalidateTag("products", { expire: 0 });
  revalidateTag("store", { expire: 0 });
  return Response.json({ ok: true, count: deleted.length });
}
