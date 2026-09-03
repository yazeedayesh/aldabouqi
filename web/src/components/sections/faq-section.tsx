import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FaqAccordion({ items }: { items: ReadonlyArray<{ question: string; answer: string }> }) {
  return (
    <Accordion className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} value={index}>
          <AccordionTrigger className="text-start font-heading">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FaqSection({
  title,
  items,
}: {
  title?: string;
  items: ReadonlyArray<{ question: string; answer: string }>;
}) {
  if (!title) {
    return <FaqAccordion items={items} />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
        {title}
      </h2>
      <FaqAccordion items={items} />
    </section>
  );
}
