"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DangerZoneSection({ hiddenCount, inquiryCount }: { hiddenCount: number; inquiryCount: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function run(key: string, url: string, confirmPhrase: string) {
    const typed = prompt(`هاي العملية ما بترجع. اكتب "${confirmPhrase}" للتأكيد:`);
    if (typed !== confirmPhrase) return;
    setBusy(key);
    await fetch(url, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="rounded-[22px] bg-white p-6.5">
      <h2 className="mb-1.5 font-heading text-lg font-extrabold text-admin-danger">منطقة الخطر</h2>
      <p className="mb-4.5 text-[12.5px] leading-[1.75] text-admin-muted">
        العمليات هون ما بترجع. بتحتاج تأكيد بكتابة اسم العنصر.
      </p>

      <div className="flex items-center justify-between gap-3 border-t border-admin-divider py-3.5">
        <div>
          <p className="mb-0.5 text-sm font-semibold text-foreground">حذف كل المنتجات المخفية</p>
          <p className="text-[12.5px] text-admin-muted">{hiddenCount} منتجات</p>
        </div>
        <button
          type="button"
          disabled={busy !== null || hiddenCount === 0}
          onClick={() => run("hidden", "/api/admin/danger/hidden-products", "حذف")}
          className="h-12 shrink-0 rounded-full bg-admin-danger px-6 text-[14.5px] font-bold text-white disabled:opacity-40"
        >
          {busy === "hidden" ? "جارٍ الحذف..." : "حذف"}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-admin-divider py-3.5">
        <div>
          <p className="mb-0.5 text-sm font-semibold text-foreground">تفريغ سجل طلبات واتساب</p>
          <p className="text-[12.5px] text-admin-muted">{inquiryCount} سجل</p>
        </div>
        <button
          type="button"
          disabled={busy !== null || inquiryCount === 0}
          onClick={() => run("inquiries", "/api/admin/danger/inquiries", "تفريغ")}
          className="h-12 shrink-0 rounded-full bg-admin-danger px-6 text-[14.5px] font-bold text-white disabled:opacity-40"
        >
          {busy === "inquiries" ? "جارٍ التفريغ..." : "تفريغ"}
        </button>
      </div>
    </div>
  );
}
