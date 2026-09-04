import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { categorySchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";
import { isForeignKeyViolation, isUniqueViolation } from "../route";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const [row] = await getDb()
      .update(categories)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return Response.json({ error: "الرابط (slug) مستخدم لفئة أخرى بالفعل" }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  try {
    const [row] = await getDb().delete(categories).where(eq(categories.id, id)).returning();
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return Response.json(
        { error: "لا يمكن حذف هذه الفئة لأنها مستخدمة في منتجات حالية — انقل المنتجات لفئة أخرى أولاً" },
        { status: 409 }
      );
    }
    throw error;
  }
}
