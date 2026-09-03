"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyzegrly";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-secondary/40 p-8 text-center">
        <p className="font-heading text-lg font-semibold text-foreground">{t("successTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="full_name"
          placeholder={t("fullName")}
          required
          autoComplete="name"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <input
          type="email"
          name="email"
          placeholder={t("email")}
          required
          autoComplete="email"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <input
          type="tel"
          name="phone"
          placeholder={t("phone")}
          required
          autoComplete="tel"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <Select name="subject" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("subject")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={t("subjectBuy")}>{t("subjectBuy")}</SelectItem>
            <SelectItem value={t("subjectSell")}>{t("subjectSell")}</SelectItem>
            <SelectItem value={t("subjectInquiry")}>{t("subjectInquiry")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <textarea
        name="message"
        placeholder={t("message")}
        required
        rows={5}
        className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {status === "error" && (
        <p className="text-sm text-destructive">{t("errorMessage")}</p>
      )}
      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {t("submit")}
      </Button>
    </form>
  );
}
