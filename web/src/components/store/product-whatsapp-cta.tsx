"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildStoreWhatsAppLink } from "@/lib/constants";
import { buildWhatsAppLinkFor } from "@/lib/business";
import { cn } from "@/lib/utils";

/**
 * Primary CTA on every product page (brief: WhatsApp is always the biggest,
 * most prominent action — COD checkout, when it exists at all, is a smaller
 * option below it). Also fires the inquiry log (§7.6) before the WhatsApp
 * tab opens; since the link opens in a new tab, the current page never
 * unloads, so a plain fire-and-forget fetch is enough — no need to block
 * navigation on it.
 */
export function ProductWhatsAppCta({
  productId,
  productTitleAr,
  message,
  label,
  /** Resolved per-product override (admin v2 brief, 2026-09-08: "الروابط
   * بصفحة المنتج لازم تستخدم الرقم المختار فعليًا") — falls back to the
   * store's default WhatsApp number when not given. */
  whatsappPhoneE164,
  compact = false,
  className,
}: {
  productId: string;
  productTitleAr: string;
  message: string;
  label: string;
  whatsappPhoneE164?: string;
  /** Small pill sized to sit inside a product card's hover-action row, instead of the full-size purchase-panel CTA. */
  compact?: boolean;
  className?: string;
}) {
  function logInquiry() {
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, productTitleAr }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <Button
      size={compact ? "sm" : "lg"}
      className={cn(
        "rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-dark",
        compact ? "h-[38px] flex-1 gap-1.5 text-[13px] font-bold" : "h-13 px-6 text-base",
        className
      )}
      nativeButton={false}
      render={
        <a
          href={whatsappPhoneE164 ? buildWhatsAppLinkFor(whatsappPhoneE164, message) : buildStoreWhatsAppLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={logInquiry}
        />
      }
    >
      <MessageCircle className={compact ? "size-[15px]" : "size-5"} strokeWidth={compact ? 1.9 : 1.7} />
      {label}
    </Button>
  );
}
