import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = await put(`products/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
  });

  return Response.json({ url: blob.url });
}
