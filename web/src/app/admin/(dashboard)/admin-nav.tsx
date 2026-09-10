"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LayoutGrid, LogOut, Menu, MessageCircle, Package, Settings, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Plain <Link>/<Image>, not the public site's SiteLogo — the admin panel's
// root layout has no NextIntlClientProvider (it's outside the [locale]
// routing tree entirely), so next-intl's Link/usePathname would break here.
function AdminLogo() {
  return (
    <Link href="/admin/dashboard" className="shrink-0">
      <Image
        src="/img/logo/aldabouqi-black.webp"
        alt="شعار شركة الدابوقي"
        width={200}
        height={98}
        priority
        className="h-7 w-auto brightness-0 invert"
      />
    </Link>
  );
}

type NavLinkDef = { href: string; label: string; icon: typeof LayoutDashboard; badge?: number };

export function AdminNav({ inquiriesThisWeek, username }: { inquiriesThisWeek: number; username: string }) {
  const [open, setOpen] = useState(false);

  const links: NavLinkDef[] = [
    { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/admin/products", label: "المنتجات", icon: Package },
    { href: "/admin/categories", label: "الأقسام", icon: LayoutGrid },
    { href: "/admin/inquiries", label: "طلبات واتساب", icon: MessageCircle, badge: inquiriesThisWeek },
    { href: "/admin/orders", label: "طلبات الدفع عند الاستلام", icon: ShoppingCart },
    { href: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <>
      {/* Mobile top bar — reuses the same Sheet component as the public
          site's MobileNav. */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-admin-sidebar px-4 py-3 lg:hidden">
        <AdminLogo />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon-sm" aria-label="فتح القائمة" className="text-ink-foreground hover:bg-white/10 hover:text-ink-foreground" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-admin-sidebar p-0 text-ink-foreground">
            <SheetHeader className="border-b border-admin-sidebar-border px-6 py-5">
              <AdminLogo />
              <SheetTitle className="sr-only">الدابوقي — لوحة التحكم</SheetTitle>
            </SheetHeader>
            <NavLinks links={links} username={username} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden h-full w-68 shrink-0 flex-col bg-admin-sidebar text-ink-foreground lg:flex">
        <div className="flex items-center gap-3 px-4.5 py-5.5">
          <AdminLogo />
          <span className="text-xs font-semibold tracking-widest text-admin-sidebar-subtle">ADMIN</span>
        </div>
        <NavLinks links={links} username={username} />
      </aside>
    </>
  );
}

function NavLinks({ links, username, onNavigate }: { links: NavLinkDef[]; username: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col px-4 pb-4">
      <nav className="flex-1 space-y-1.5">
        {links.map((link, i) => (
          <Link
            key={`${link.href}-${i}`}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex h-[46px] min-h-11 items-center gap-3 rounded-[14px] px-3.5 text-[14.5px] font-medium transition-colors",
              pathname.startsWith(link.href)
                ? "bg-primary font-bold text-white"
                : "text-admin-sidebar-muted hover:bg-white/5 hover:text-ink-foreground"
            )}
          >
            <link.icon className="size-[19px]" strokeWidth={1.8} />
            <span className="flex-1">{link.label}</span>
            {link.badge !== undefined && link.badge > 0 && (
              <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-vivid px-1.5 text-[11.5px] font-extrabold text-whatsapp-foreground">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-admin-sidebar-border px-3 pt-4">
        <div className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-primary font-heading text-[15px] font-extrabold text-white">
          {username.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold text-[#E8EAED]">{username}</p>
          <p className="text-[11.5px] text-admin-sidebar-subtle">مدير الموقع</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ redirectTo: "/admin/login" })}
          aria-label="تسجيل الخروج"
          className="text-admin-sidebar-subtle hover:text-ink-foreground"
        >
          <LogOut className="size-[18px]" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
