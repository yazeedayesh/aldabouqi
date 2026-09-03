import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminNav } from "./admin-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-full flex-col">
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl flex-1 p-6">{children}</main>
    </div>
  );
}
