"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildStoreWhatsAppLink } from "@/lib/constants";

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
}: {
  productId: string;
  productTitleAr: string;
  message: string;
  label: string;
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
      size="lg"
      className="h-13 bg-whatsapp px-6 text-base text-white hover:bg-whatsapp-dark"
      nativeButton={false}
      render={
        <a
          href={buildStoreWhatsAppLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={logInquiry}
        />
      }
    >
      <MessageCircle className="size-5" strokeWidth={1.7} />
      {label}
    </Button>
  );
}
