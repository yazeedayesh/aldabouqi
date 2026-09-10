import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contactNumbers } from "@/db/schema";
import { contactNumberSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";
import { unsetOtherDefaults } from "../unset-other-defaults";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = contactNumberSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = getDb();
  if (parsed.data.isDefault) await unsetOtherDefaults(db, id);

  const [row] = await db
    .update(contactNumbers)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(contactNumbers.id, id))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const db = getDb();

  const [target] = await db.select().from(contactNumbers).where(eq(contactNumbers.id, id));
  if (!target) return Response.json({ error: "Not found" }, { status: 404 });
  if (target.isDefault) {
    return Response.json(
      { error: "لا يمكن حذف الرقم الافتراضي — عيّن رقم آخر كافتراضي أولاً" },
      { status: 409 }
    );
  }

  await db.delete(contactNumbers).where(eq(contactNumbers.id, id));
  return Response.json({ ok: true });
}
