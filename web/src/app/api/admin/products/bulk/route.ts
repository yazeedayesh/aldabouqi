import { inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

const bulkSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("publish"), ids: z.array(z.string().uuid()).min(1) }),
  z.object({ action: z.literal("hide"), ids: z.array(z.string().uuid()).min(1) }),
  z.object({ action: z.literal("move"), ids: z.array(z.string().uuid()).min(1), category: z.string().min(1) }),
  z.object({ action: z.literal("delete"), ids: z.array(z.string().uuid()).min(1) }),
]);

/** Bulk row-selection actions on the admin products list (admin v2 brief,
 * 2026-09-08: "شريط إجراءات جماعية"). */
export async function PATCH(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = getDb();
  const { action, ids } = parsed.data;

  if (action === "delete") {
    await db.delete(products).where(inArray(products.id, ids));
  } else if (action === "publish") {
    await db.update(products).set({ visibility: "published", updatedAt: new Date() }).where(inArray(products.id, ids));
  } else if (action === "hide") {
    await db.update(products).set({ visibility: "hidden", updatedAt: new Date() }).where(inArray(products.id, ids));
  } else {
    await db.update(products).set({ category: parsed.data.category, updatedAt: new Date() }).where(inArray(products.id, ids));
  }

  return Response.json({ ok: true, count: ids.length });
}
