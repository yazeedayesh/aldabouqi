import Image from "next/image";
import { CheckCircle2, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { FaqSection } from "@/components/sections/faq-section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { BUSINESS } from "@/lib/constants";

type Step = { title: string; subtitle: string; body: string };
type Feature = { title: string; body: string };
type OtherService = { label: string; href?: `/${string}` };
type PageImage = { src: string; alt: string };

export function CategoryPageTemplate({
  pageTitle,
  breadcrumbs,
  heroImage,
  introTitle,
  introBody,
  introImage,
  bullets,
  features,
  featuresImage,
  howToTitle,
  howToIntro,
  steps,
  faqTitle,
  faq,
  otherServicesTitle,
  otherServices,
  experienceLabel,
  ctaTitle,
  callCta,
}: {
  pageTitle: string;
  breadcrumbs: Array<{ href: string; label: string }>;
  /** Real product photo, shown as the hero background — brief follow-up,
   * 2026-09-05: every city/category page gets a real photo, not just text. */
  heroImage?: PageImage;
  introTitle: string;
  introBody: string;
  introImage?: PageImage;
  bullets: string[];
  features: Feature[];
  featuresImage?: PageImage;
  howToTitle: string;
  howToIntro: string;
  steps: Step[];
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
  otherServicesTitle: string;
  otherServices: OtherService[];
  experienceLabel: string;
  ctaTitle: string;
  callCta: string;
}) {
  return (
    <>
      <PageHero title={pageTitle} crumbs={breadcrumbs} image={heroImage} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className={introImage ? "grid gap-8 sm:grid-cols-2 sm:items-center" : "mx-auto max-w-4xl"}>
          <div className={introImage ? "sm:order-1" : undefined}>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {introTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{introBody}</p>
            <ul className="mt-6 space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          {introImage && (
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl sm:order-2">
              <Image
                src={introImage.src}
                alt={introImage.alt}
                fill
                loading="lazy"
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary/30 py-16">
        <div
          className={
            "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" +
            (featuresImage ? " grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center" : "")
          }
        >
          {featuresImage && (
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl lg:order-2">
              <Image
                src={featuresImage.src}
                alt={featuresImage.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className={featuresImage ? "grid gap-6 lg:order-1" : "grid gap-6 sm:grid-cols-3"}>
            {features.map((feature, i) => (
              <Reveal key={feature.title} delayMs={i * 100}>
                <div className="rounded-xl bg-background p-6 text-center shadow-sm">
                  <h3 className="font-heading font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{howToTitle}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{howToIntro}</p>
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal
              key={step.title}
              as="li"
              delayMs={(index % 4) * 100}
              className="rounded-xl border border-border p-6"
            >
              <span className="font-heading text-3xl font-bold text-primary/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-heading font-semibold text-foreground">
                {step.title} <span className="block font-normal text-muted-foreground">{step.subtitle}</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <FaqSection title={faqTitle} items={faq} />

      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-xl font-bold text-foreground">
            {otherServicesTitle}
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {otherServices.map((service) =>
              service.href ? (
                <Link
                  key={service.label}
                  href={service.href}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                >
                  {service.label}
                </Link>
              ) : (
                <Link
                  key={service.label}
                  href="/services"
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                >
                  {service.label}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-primary">{experienceLabel}</p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">{ctaTitle}</h2>
        <Button
          size="lg"
          className="mt-6"
          nativeButton={false}
          render={<a href={`tel:${BUSINESS.phoneE164}`} />}
        >
          <Phone className="size-4" />
          {callCta}
        </Button>
      </section>
    </>
  );
}
