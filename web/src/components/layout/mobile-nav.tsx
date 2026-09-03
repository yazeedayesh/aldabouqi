"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, MessageCircle, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BUSINESS, buildWhatsAppLink } from "@/lib/constants";

type NavLink = { href: string; label: string };

export function MobileNav({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const cta = useTranslations("cta");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label={t("openMenu")}
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{BUSINESS.nameAr}</SheetTitle>
        </SheetHeader>
        <nav aria-label="القائمة الرئيسية" className="flex-1 px-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-base font-medium text-foreground/90 hover:bg-accent hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-2 border-t border-border p-4">
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href={`tel:${BUSINESS.phoneE164}`} aria-label={cta("call")} />}
          >
            <Phone className="size-4" />
            {cta("call")}
          </Button>
          <Button
            className="bg-[#25D366] text-white hover:bg-[#1ebe57]"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppLink(cta("whatsappDefaultMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={cta("whatsapp")}
              />
            }
          >
            <MessageCircle className="size-4" />
            {cta("whatsapp")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
