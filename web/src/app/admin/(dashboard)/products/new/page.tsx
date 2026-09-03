import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">إضافة منتج جديد</h1>
      <ProductForm />
    </div>
  );
}
