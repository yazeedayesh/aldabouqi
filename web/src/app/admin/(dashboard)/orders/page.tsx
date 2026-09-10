import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, products } from "@/db/schema";
import { AdminPageHeader } from "../admin-page-header";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-accent text-primary",
  cancelled: "bg-admin-divider text-admin-muted",
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
      <AdminPageHeader title="الطلبات" subtitle={`${rows.length} طلب`} />

      {rows.length === 0 ? (
        <div className="rounded-[22px] bg-white p-6.5">
          <div className="py-16 text-center text-admin-muted">لا يوجد طلبات بعد</div>
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-3 lg:hidden">
            {rows.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block rounded-[20px] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-foreground">{order.customerName}</p>
                    <p className="mt-0.5 truncate text-[12.5px] text-admin-muted-2">{order.productTitle ?? "—"}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <p dir="ltr" className="mt-2 text-end text-[13px] text-admin-muted-2">{order.customerPhone}</p>
              </Link>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden rounded-[22px] bg-white p-6.5 lg:block">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px_120px_100px] items-center gap-3.5 pb-3 text-[12.5px] font-semibold text-admin-muted">
              <div>العميل</div>
              <div>المنتج</div>
              <div>الهاتف</div>
              <div>الحالة</div>
              <div />
            </div>
            {rows.map((order) => (
              <div key={order.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px_120px_100px] items-center gap-3.5 border-t border-admin-divider py-3.5">
                <div className="truncate text-[14.5px] font-semibold text-foreground">{order.customerName}</div>
                <div className="truncate text-[13.5px] text-admin-muted-2">{order.productTitle ?? "—"}</div>
                <div dir="ltr" className="truncate text-[13.5px] text-admin-muted-2">{order.customerPhone}</div>
                <div>
                  <span className={`flex h-[26px] w-fit items-center rounded-full px-2.5 text-xs font-bold ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Link href={`/admin/orders/${order.id}`} className="flex h-9 items-center rounded-[11px] bg-admin-input px-3.5 text-[13px] font-semibold text-admin-muted-2">
                    التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
