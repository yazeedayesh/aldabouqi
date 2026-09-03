import Link from "next/link";
import Image from "next/image";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { Button } from "@/components/ui/button";

const statusLabels: Record<string, string> = {
  available: "متوفر",
  reserved: "محجوز",
  sold: "مباع",
  draft: "مسودة",
};

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  reserved: "bg-yellow-100 text-yellow-700",
  sold: "bg-gray-200 text-gray-600",
  draft: "bg-blue-100 text-blue-700",
};

export default async function AdminProductsPage() {
  const rows = await getDb().select().from(products).orderBy(desc(products.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">المنتجات</h1>
        <Button nativeButton={false} render={<Link href="/admin/products/new" />}>
          <Plus className="size-4" />
          إضافة منتج
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-start">
            <tr>
              <th className="p-3 text-start font-medium">الصورة</th>
              <th className="p-3 text-start font-medium">العنوان</th>
              <th className="p-3 text-start font-medium">السعر</th>
              <th className="p-3 text-start font-medium">الحالة</th>
              <th className="p-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="size-12 rounded-lg bg-secondary" />
                  )}
                </td>
                <td className="p-3 font-medium text-foreground">{product.titleAr}</td>
                <td className="p-3 text-muted-foreground">
                  {product.price ? `${product.price} د.أ` : "عند المعاينة"}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[product.status]}`}
                  >
                    {statusLabels[product.status]}
                  </span>
                </td>
                <td className="p-3 text-end">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    تعديل
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  لا يوجد منتجات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
