import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { contactNumbers } from "@/db/schema";
import { contactNumberSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";
import { unsetOtherDefaults } from "./unset-other-defaults";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const rows = await getDb().select().from(contactNumbers).orderBy(asc(contactNumbers.sortOrder));
  return Response.json(rows);
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = contactNumberSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = getDb();
  if (parsed.data.isDefault) await unsetOtherDefaults(db);

  const [row] = await db.insert(contactNumbers).values(parsed.data).returning();
  revalidatePath("/", "layout");
  return Response.json(row, { status: 201 });
}
