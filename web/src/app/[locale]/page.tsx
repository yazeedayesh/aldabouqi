import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/constants";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Hero />;
}

function Hero() {
  const t = useTranslations("home");
  const cta = useTranslations("cta");

  return (
    <section className="relative overflow-hidden bg-secondary/30">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground font-heading sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>
          <Button
            size="lg"
            className="bg-[#25D366] text-white hover:bg-[#1ebe57]"
            render={
              <a
                href={buildWhatsAppLink(cta("whatsappDefaultMessage"))}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <MessageCircle className="size-5" />
            {cta("whatsapp")}
          </Button>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="/img/hero/furntuer.webp"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
