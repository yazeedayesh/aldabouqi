import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { Button } from "@/components/ui/button";

export function generateMetadata() {
  return {
    title: "تأكيد الطلب",
    robots: { index: false, follow: false },
  };
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: PageProps<"/[locale]/store/order-confirmation/[id]">) {
  const { locale, id } = await params;
  const { whatsapp } = await searchParams;
  setRequestLocale(locale);

  const [order] = await getDb().select().from(orders).where(eq(orders.id, id));
  if (!order) notFound();

  const whatsappLink = typeof whatsapp === "string" ? whatsapp : null;

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="size-16 text-primary" />
      <h1 className="mt-6 font-heading text-2xl font-bold text-foreground">
        {locale === "en" ? "Order received!" : "تم استلام طلبك!"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {locale === "en"
          ? "Please confirm the details with us on WhatsApp to finalize your cash-on-delivery order."
          : "أكّد التفاصيل معنا عبر واتساب لإتمام طلبك (الدفع نقداً عند الاستلام)."}
      </p>

      {whatsappLink && (
        <Button
          size="lg"
          className="mt-8 bg-[#25D366] text-white hover:bg-[#1ebe57]"
          nativeButton={false}
          render={<a href={whatsappLink} target="_blank" rel="noopener noreferrer" />}
        >
          <MessageCircle className="size-4" />
          {locale === "en" ? "Confirm on WhatsApp" : "تأكيد عبر واتساب"}
        </Button>
      )}

      <Link href="/store" className="mt-6 text-sm font-medium text-muted-foreground hover:text-primary">
        {locale === "en" ? "Back to store" : "الرجوع للمتجر"}
      </Link>
    </section>
  );
}
