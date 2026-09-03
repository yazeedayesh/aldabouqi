import type { Metadata } from "next";
import { bodyFont, headingFont } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "لوحة التحكم | شركة الدابوقي",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}>
      <body className="min-h-full bg-secondary/20">{children}</body>
    </html>
  );
}
