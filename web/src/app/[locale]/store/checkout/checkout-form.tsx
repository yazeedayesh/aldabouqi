"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { areas } from "@/lib/areas";
import { buildWhatsAppLink, BUSINESS } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

type Product = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  price: number | null;
};

export function CheckoutForm({ product, locale }: { product: Product; locale: Locale }) {
  const router = useRouter();
  const [area, setArea] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      productId: product.id,
      customerName: data.get("customerName"),
      customerPhone: data.get("customerPhone"),
      deliveryAddress: data.get("deliveryAddress"),
      area: area || null,
      notes: data.get("notes") || null,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError(
        locale === "en"
          ? "Something went wrong placing your order. Please try again or contact us on WhatsApp."
          : "حدث خطأ أثناء إرسال طلبك. حاول مرة أخرى أو تواصل معنا عبر واتساب."
      );
      setSubmitting(false);
      return;
    }

    const order = await res.json();
    const title = locale === "en" ? product.titleEn : product.titleAr;
    const priceLine = product.price
      ? locale === "en"
        ? `Price: ${product.price} JOD`
        : `السعر: ${product.price} د.أ`
      : "";
    const message =
      locale === "en"
        ? `Hi, I'd like to order: ${title}\n${priceLine}\nName: ${payload.customerName}\nPhone: ${payload.customerPhone}\nAddress: ${payload.deliveryAddress}`
        : `مرحباً، بدي أطلب: ${title}\n${priceLine}\nالاسم: ${payload.customerName}\nالهاتف: ${payload.customerPhone}\nالعنوان: ${payload.deliveryAddress}`;

    router.push(
      `/store/order-confirmation/${order.id}?whatsapp=${encodeURIComponent(buildWhatsAppLink(message))}`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="customerName"
        placeholder={locale === "en" ? "Full name*" : "الاسم الكامل*"}
        required
        className="input"
      />
      <input
        name="customerPhone"
        type="tel"
        placeholder={locale === "en" ? "Phone*" : "رقم الهاتف*"}
        required
        dir="ltr"
        className="input"
      />
      <input
        name="deliveryAddress"
        placeholder={locale === "en" ? "Delivery address*" : "عنوان التوصيل*"}
        required
        className="input"
      />
      <Select value={area} onValueChange={(value) => setArea(value ?? "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={locale === "en" ? "Area (optional)" : "المنطقة (اختياري)"} />
        </SelectTrigger>
        <SelectContent>
          {areas.map((a) => (
            <SelectItem key={a.slug} value={a.slug}>
              {locale === "en" ? a.nameEn : a.nameAr}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <textarea
        name="notes"
        placeholder={locale === "en" ? "Notes (optional)" : "ملاحظات (اختياري)"}
        rows={3}
        className="input resize-none"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {locale === "en" ? "Place Order (Cash on Delivery)" : "تأكيد الطلب (دفع عند الاستلام)"}
      </Button>
      <p className="text-xs text-muted-foreground">
        {locale === "en"
          ? `You'll be redirected to WhatsApp to confirm with us — no online payment, cash on delivery only. ${BUSINESS.phoneDisplay}`
          : `رح ننقلك لواتساب لتأكيد الطلب معنا — الدفع نقداً عند الاستلام فقط. ${BUSINESS.phoneDisplay}`}
      </p>
    </form>
  );
}
