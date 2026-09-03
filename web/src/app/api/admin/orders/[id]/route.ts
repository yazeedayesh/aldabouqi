import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { orderStatuses } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";

const statusSchema = z.object({ status: z.enum(orderStatuses) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await getDb()
    .update(orders)
    .set({ status: parsed.data.status })
    .where(eq(orders.id, id))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}
