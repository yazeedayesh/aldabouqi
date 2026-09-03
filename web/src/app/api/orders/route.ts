import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, products } from "@/db/schema";
import { orderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = getDb();
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, parsed.data.productId));

  if (!product || product.status !== "available") {
    return Response.json({ error: "المنتج غير متوفر حالياً" }, { status: 409 });
  }

  const [order] = await db.insert(orders).values(parsed.data).returning();
  return Response.json(order, { status: 201 });
}
