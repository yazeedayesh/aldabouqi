import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { AdminPageHeader } from "../admin-page-header";

export default async function AdminInquiriesPage() {
  const rows = await getDb().select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(200);

  return (
    <div>
      <AdminPageHeader
        title="طلبات واتساب"
        subtitle="كل ضغطة على زر واتساب بصفحة منتج تُسجَّل هنا تلقائيًا — بدون أي بيانات شخصية"
      />

      {rows.length === 0 ? (
        <div className="rounded-[22px] bg-white p-6.5">
          <div className="py-16 text-center text-admin-muted">لا توجد استفسارات واتساب بعد</div>
        </div>
      ) : (
        <div className="rounded-[22px] bg-white p-6.5">
          <div className="hidden grid-cols-[minmax(0,1fr)_180px] gap-3.5 pb-3 text-[12.5px] font-semibold text-admin-muted sm:grid">
            <div>المنتج</div>
            <div>التاريخ والوقت</div>
          </div>
          {rows.map((row) => (
            <div key={row.id} className="flex flex-col gap-1 border-t border-admin-divider py-3.5 sm:grid sm:grid-cols-[minmax(0,1fr)_180px] sm:items-center sm:gap-3.5">
              <div className="truncate text-[14.5px] font-semibold text-foreground">{row.productTitleAr}</div>
              <div className="text-[13px] text-admin-muted-2">
                {new Date(row.createdAt).toLocaleString("ar-JO", { dateStyle: "medium", timeStyle: "short" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
