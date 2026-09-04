import { CategoryForm } from "../category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">إضافة فئة جديدة</h1>
      <CategoryForm />
    </div>
  );
}
