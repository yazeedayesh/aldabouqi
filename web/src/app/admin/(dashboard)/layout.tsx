import { redirect } from "next/navigation";
import { gte } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { daysAgo } from "@/lib/utils";
import { AdminNav } from "./admin-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const weekAgo = daysAgo(7);
  const recentInquiries = await getDb()
    .select()
    .from(inquiries)
    .where(gte(inquiries.createdAt, weekAgo));

  return (
    <div className="flex min-h-full">
      <AdminNav inquiriesThisWeek={recentInquiries.length} />
      <main className="min-w-0 flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
