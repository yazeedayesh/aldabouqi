import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { changePasswordSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function PATCH(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = getDb();
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, "admin"));
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  // Server-side verification of the current password is mandatory (admin v2
  // brief, 2026-09-08) — never trust that the client-side form actually
  // checked it.
  if (!verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
    return Response.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 403 });
  }

  await db
    .update(adminUsers)
    .set({ passwordHash: hashPassword(parsed.data.newPassword), updatedAt: new Date() })
    .where(eq(adminUsers.id, "admin"));

  return Response.json({ ok: true });
}
