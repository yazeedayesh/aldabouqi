import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";

export default async function AdminInquiriesPage() {
  const rows = await getDb().select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(200);

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">طلبات واتساب</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        كل ضغطة على زر واتساب في صفحة منتج تُسجَّل هنا تلقائياً — بدون أي بيانات شخصية، المحادثة نفسها تتم داخل واتساب.
      </p>

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-start">
            <tr>
              <th className="p-3 text-start font-medium">المنتج</th>
              <th className="p-3 text-start font-medium">التاريخ والوقت</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium text-foreground">{row.productTitleAr}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(row.createdAt).toLocaleString("ar-JO", { dateStyle: "medium", timeStyle: "short" })}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="p-8 text-center text-muted-foreground">
                  لا توجد استفسارات واتساب بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
