import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products, type ProductImage } from "@/db/schema";
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

  const { images: rawImages, ...restUpdates } = parsed.data;
  let images: ProductImage[] | undefined;
  if (rawImages) {
    const [existing] = await getDb().select().from(products).where(eq(products.id, id));
    const titleAr = restUpdates.titleAr ?? existing?.titleAr ?? "";
    const categorySlug = restUpdates.category ?? existing?.category;
    const [categoryRow] = categorySlug
      ? await getDb().select().from(categories).where(eq(categories.slug, categorySlug))
      : [undefined];
    images = fillImageAlts(rawImages, titleAr, categoryRow?.nameAr ?? "");
  }

  const [row] = await getDb()
    .update(products)
    .set({ ...restUpdates, ...(images ? { images } : {}), updatedAt: new Date() })
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
