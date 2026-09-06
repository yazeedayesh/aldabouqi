import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { productSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";
import { pingIndexNow } from "@/lib/indexnow";
import { fillImageAlts } from "@/lib/generate-alt";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates = { ...parsed.data };
  if (updates.images) {
    const [existing] = await getDb().select().from(products).where(eq(products.id, id));
    const titleAr = updates.titleAr ?? existing?.titleAr ?? "";
    const categorySlug = updates.category ?? existing?.category;
    const [categoryRow] = categorySlug
      ? await getDb().select().from(categories).where(eq(categories.slug, categorySlug))
      : [undefined];
    updates.images = fillImageAlts(updates.images, titleAr, categoryRow?.nameAr ?? "");
  }

  const [row] = await getDb()
    .update(products)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  if (row.status !== "draft") {
    pingIndexNow([`/store/${row.category}/${row.slug}`, `/en/store/${row.category}/${row.slug}`]);
  }
  return Response.json(row);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await getDb().delete(products).where(eq(products.id, id));
  return Response.json({ ok: true });
}
