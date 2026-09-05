"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LayoutGrid, LogOut, MessageCircle, Package, Settings, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav({ inquiriesThisWeek }: { inquiriesThisWeek: number }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/admin/products", label: "المنتجات", icon: Package },
    { href: "/admin/categories", label: "الأقسام", icon: LayoutGrid },
    { href: "/admin/orders", label: "طلبات الدفع عند الاستلام", icon: ShoppingCart },
    { href: "/admin/inquiries", label: "طلبات واتساب", icon: MessageCircle, badge: inquiriesThisWeek },
    { href: "/admin/settings", label: "الإعدادات", icon: Settings },
  ] as const;

  return (
    <aside className="flex h-full w-66 shrink-0 flex-col bg-ink text-ink-foreground">
      <div className="border-b border-ink-border px-6 py-5">
        <p className="font-heading text-lg font-bold">الدابوقي</p>
        <p className="text-xs text-ink-muted">لوحة التحكم</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith(link.href)
                ? "bg-primary/15 text-primary"
                : "text-ink-muted hover:bg-white/5 hover:text-ink-foreground"
            )}
          >
            <link.icon className="size-4.5" strokeWidth={1.7} />
            {link.label}
            {"badge" in link && link.badge > 0 && (
              <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t border-ink-border p-3">
        <button
          type="button"
          onClick={() => signOut({ redirectTo: "/admin/login" })}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-white/5 hover:text-ink-foreground"
        >
          <LogOut className="size-4.5" strokeWidth={1.7} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
