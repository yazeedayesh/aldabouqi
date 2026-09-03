import { z } from "zod";

export const productCategories = ["bedrooms", "salons", "offices", "appliances", "other"] as const;
export const productConditions = ["excellent", "good", "fair"] as const;
export const productStatuses = ["available", "reserved", "sold", "draft"] as const;
export const orderStatuses = ["pending", "confirmed", "delivered", "cancelled"] as const;

export const productSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "أحرف إنجليزية صغيرة وأرقام وشرطات فقط"),
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  descriptionAr: z.string().min(2),
  descriptionEn: z.string().min(2),
  category: z.enum(productCategories),
  condition: z.enum(productConditions),
  price: z.coerce.number().int().positive().nullable(),
  area: z.string().nullable(),
  status: z.enum(productStatuses),
  images: z.array(z.string().url()),
});

export type ProductInput = z.infer<typeof productSchema>;

export const orderSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  deliveryAddress: z.string().min(2),
  area: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
