import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { getDb } from "@/db";
import { categories, products, type ProductImage } from "@/db/schema";
import { productSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";
import { pingIndexNow } from "@/lib/indexnow";
import { fillImageAlts } from "@/lib/generate-alt";
import { generateUniqueProductSlug } from "@/lib/slug";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { images: rawImages, slug: rawSlug, ...restUpdates } = parsed.data;
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

  // Only touch the slug when the admin explicitly opted into manual editing
  // (form's "تعديل يدوي" toggle) — otherwise the existing slug is preserved
  // so published links never silently break from a routine edit.
  const slug = rawSlug !== undefined ? await generateUniqueProductSlug(rawSlug, id) : undefined;

  const [row] = await getDb()
    .update(products)
    .set({ ...restUpdates, ...(slug ? { slug } : {}), ...(images ? { images } : {}), updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  if (row.visibility === "published") {
    pingIndexNow([`/store/${row.category}/${row.slug}`, `/en/store/${row.category}/${row.slug}`]);
  }
  // revalidatePath busts the page/route cache; revalidateTag busts the
  // separate Data Cache entry lib/store-data.ts's getCachedProducts()
  // lives in (unstable_cache, 1h revalidate) — both are needed or edits
  // silently keep serving the stale cached catalog. { expire: 0 }, not
  // the "max" profile, so the next request doesn't still get one more
  // round of stale data.
  revalidatePath("/", "layout");
  revalidateTag("products", { expire: 0 });
  revalidateTag("store", { expire: 0 });
  return Response.json(row);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await getDb().delete(products).where(eq(products.id, id));
  revalidatePath("/", "layout");
  revalidateTag("products", { expire: 0 });
  revalidateTag("store", { expire: 0 });
  return Response.json({ ok: true });
}
