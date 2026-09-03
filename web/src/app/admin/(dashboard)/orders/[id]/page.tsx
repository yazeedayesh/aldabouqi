import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { orders, products } from "@/db/schema";
import { OrderStatusSelect } from "./order-status-select";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) notFound();

  const [product] = await db.select().from(products).where(eq(products.id, order.productId));

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-foreground">تفاصيل الطلب</h1>

      <div className="mt-6 space-y-4 rounded-xl border border-border bg-background p-6">
        <Row label="المنتج">
          {product ? (
            <Link href={`/admin/products/${product.id}`} className="text-primary hover:underline">
              {product.titleAr}
            </Link>
          ) : (
            "—"
          )}
        </Row>
        <Row label="اسم العميل">{order.customerName}</Row>
        <Row label="الهاتف">
          <span dir="ltr">{order.customerPhone}</span>
        </Row>
        <Row label="عنوان التوصيل">{order.deliveryAddress}</Row>
        <Row label="المنطقة">{order.area ?? "—"}</Row>
        <Row label="ملاحظات">{order.notes ?? "—"}</Row>
        <Row label="تاريخ الطلب">{order.createdAt.toLocaleString("ar-JO")}</Row>
        <Row label="الحالة">
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </Row>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{children}</span>
    </div>
  );
}
