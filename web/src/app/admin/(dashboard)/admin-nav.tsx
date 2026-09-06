"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LayoutGrid, LogOut, Menu, MessageCircle, Package, Settings, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavLinkDef = { href: string; label: string; icon: typeof LayoutDashboard; badge?: number };

export function AdminNav({ inquiriesThisWeek }: { inquiriesThisWeek: number }) {
  const [open, setOpen] = useState(false);

  const links: NavLinkDef[] = [
    { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/admin/products", label: "المنتجات", icon: Package },
    { href: "/admin/categories", label: "الأقسام", icon: LayoutGrid },
    { href: "/admin/orders", label: "طلبات الدفع عند الاستلام", icon: ShoppingCart },
    { href: "/admin/inquiries", label: "طلبات واتساب", icon: MessageCircle, badge: inquiriesThisWeek },
    { href: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <>
      {/* Mobile top bar — the sidebar used to be a fixed 264px column with
          no breakpoint at all, which broke the layout under lg (site owner
          follow-up, 2026-09-06: "لازم أقدر أضيف منتج كامل وأنا برا البيت").
          Reuses the same Sheet component as the public site's MobileNav. */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <p className="font-heading text-base font-bold text-foreground">الدابوقي — لوحة التحكم</p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon-sm" aria-label="فتح القائمة" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-ink p-0 text-ink-foreground">
            <SheetHeader className="border-b border-ink-border px-6 py-5">
              <SheetTitle className="font-heading text-lg font-bold text-ink-foreground">الدابوقي</SheetTitle>
              <p className="text-xs text-ink-muted">لوحة التحكم</p>
            </SheetHeader>
            <NavLinks links={links} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop sidebar — unchanged fixed 264px column. */}
      <aside className="hidden h-full w-66 shrink-0 flex-col bg-ink text-ink-foreground lg:flex">
        <div className="border-b border-ink-border px-6 py-5">
          <p className="font-heading text-lg font-bold">الدابوقي</p>
          <p className="text-xs text-ink-muted">لوحة التحكم</p>
        </div>
        <NavLinks links={links} />
      </aside>
    </>
  );
}

function NavLinks({ links, onNavigate }: { links: NavLinkDef[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith(link.href)
                ? "bg-primary/15 text-primary"
                : "text-ink-muted hover:bg-white/5 hover:text-ink-foreground"
            )}
          >
            <link.icon className="size-4.5" strokeWidth={1.7} />
            {link.label}
            {link.badge !== undefined && link.badge > 0 && (
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
    </div>
  );
}
