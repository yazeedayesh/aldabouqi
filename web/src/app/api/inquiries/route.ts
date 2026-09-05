import { getDb } from "@/db";
import { inquiries } from "@/db/schema";

/**
 * Logged fire-and-forget when a visitor clicks a product's WhatsApp CTA, so
 * the admin dashboard's "recent inquiries" widget reflects real interest
 * instead of a placeholder count (brief §7.6). No PII is stored — the
 * conversation itself happens inside WhatsApp.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const productTitleAr = typeof body?.productTitleAr === "string" ? body.productTitleAr : null;
  if (!productTitleAr) {
    return Response.json({ error: "productTitleAr is required" }, { status: 400 });
  }

  await getDb().insert(inquiries).values({
    productId: typeof body?.productId === "string" ? body.productId : null,
    productTitleAr,
  });

  return Response.json({ ok: true });
}
