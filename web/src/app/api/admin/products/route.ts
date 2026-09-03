import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { productSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const rows = await getDb().select().from(products).orderBy(desc(products.createdAt));
  return Response.json(rows);
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await getDb().insert(products).values(parsed.data).returning();
  return Response.json(row, { status: 201 });
}
