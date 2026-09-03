import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, products } from "@/db/schema";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-200 text-gray-600",
};

export default async function AdminOrdersPage() {
  const rows = await getDb()
    .select({
      id: orders.id,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      status: orders.status,
      createdAt: orders.createdAt,
      productTitle: products.titleAr,
    })
    .from(orders)
    .leftJoin(products, eq(orders.productId, products.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">الطلبات</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40">
            <tr>
              <th className="p-3 text-start font-medium">العميل</th>
              <th className="p-3 text-start font-medium">المنتج</th>
              <th className="p-3 text-start font-medium">الهاتف</th>
              <th className="p-3 text-start font-medium">الحالة</th>
              <th className="p-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium text-foreground">{order.customerName}</td>
                <td className="p-3 text-muted-foreground">{order.productTitle ?? "—"}</td>
                <td className="p-3 text-muted-foreground" dir="ltr">{order.customerPhone}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="p-3 text-end">
                  <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-primary hover:underline">
                    التفاصيل
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">لا يوجد طلبات بعد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
