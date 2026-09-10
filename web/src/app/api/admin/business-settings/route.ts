import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { businessSettings } from "@/db/schema";
import { businessSettingsSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = businessSettingsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await getDb()
    .update(businessSettings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(businessSettings.id, "default"))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}
