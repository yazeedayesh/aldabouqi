import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { categorySchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const rows = await getDb().select().from(categories).orderBy(asc(categories.sortOrder));
  return Response.json(rows);
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const [row] = await getDb().insert(categories).values(parsed.data).returning();
    return Response.json(row, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return Response.json({ error: "الرابط (slug) مستخدم لفئة أخرى بالفعل" }, { status: 409 });
    }
    throw error;
  }
}

// drizzle-orm wraps the raw postgres error in `.cause` — the Postgres
// SQLSTATE code (checked here, not the message) lives there, not on the
// top-level Error. Verified empirically against a real duplicate-key error
// from the neon-http driver.
export function isUniqueViolation(error: unknown) {
  return (error as { cause?: { code?: string } })?.cause?.code === "23505";
}

// 23503 = foreign_key_violation (insert/update referencing a missing row).
// 23001 = restrict_violation — what Postgres actually raises for an
// ON DELETE RESTRICT hit (confirmed empirically; not 23503 as you'd guess).
export function isForeignKeyViolation(error: unknown) {
  const code = (error as { cause?: { code?: string } })?.cause?.code;
  return code === "23503" || code === "23001";
}
