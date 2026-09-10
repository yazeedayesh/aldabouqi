import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { productSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";
import { pingIndexNow } from "@/lib/indexnow";
import { fillImageAlts } from "@/lib/generate-alt";
import { generateUniqueProductSlug } from "@/lib/slug";

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

  const [categoryRow] = await getDb().select().from(categories).where(eq(categories.slug, parsed.data.category));
  const images = fillImageAlts(parsed.data.images, parsed.data.titleAr, categoryRow?.nameAr ?? "");
  const slug = await generateUniqueProductSlug(parsed.data.slug || parsed.data.titleEn);

  const [row] = await getDb().insert(products).values({ ...parsed.data, slug, images }).returning();
  if (row.visibility === "published") {
    pingIndexNow([`/store/${row.category}/${row.slug}`, `/en/store/${row.category}/${row.slug}`]);
  }
  // ISR pages (store listing, product page, sitemap) otherwise wait up to
  // `revalidate` seconds to reflect admin edits — busting the whole tree
  // makes saves feel instant instead of "not working" (site owner report,
  // 2026-09-10).
  revalidatePath("/", "layout");
  return Response.json(row, { status: 201 });
}
