import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session) {
    return { session: null, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}
