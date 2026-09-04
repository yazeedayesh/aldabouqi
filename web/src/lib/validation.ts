import { z } from "zod";

export const productConditions = ["excellent", "good", "fair"] as const;
export const productStatuses = ["available", "reserved", "sold", "draft"] as const;
export const orderStatuses = ["pending", "confirmed", "delivered", "cancelled"] as const;

const slugField = z
  .string()
  .min(2)
  .regex(/^[a-z0-9-]+$/, "أحرف إنجليزية صغيرة وأرقام وشرطات فقط");

export const productSchema = z.object({
  slug: slugField,
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  descriptionAr: z.string().min(2),
  descriptionEn: z.string().min(2),
  // Validated as a plain slug string, not a static enum — the set of valid
  // categories is admin-managed (see categorySchema below); the DB's FK
  // constraint (products.category -> categories.slug) is the actual source
  // of truth and rejects unknown category slugs at insert/update time.
  category: z.string().min(1),
  condition: z.enum(productConditions),
  price: z.coerce.number().int().positive().nullable(),
  area: z.string().nullable(),
  status: z.enum(productStatuses),
  images: z.array(z.string().url()),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  slug: slugField,
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  image: z.string().url().nullable(),
  sortOrder: z.coerce.number().int(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const orderSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  deliveryAddress: z.string().min(2),
  area: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
