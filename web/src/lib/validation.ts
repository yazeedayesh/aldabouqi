import { z } from "zod";

export const productConditions = ["excellent", "good", "fair"] as const;
// Availability only — "draft" moved to productVisibilities below.
export const productStatuses = ["available", "reserved", "sold"] as const;
export const productVisibilities = ["published", "hidden", "draft"] as const;
export const orderStatuses = ["pending", "confirmed", "delivered", "cancelled"] as const;

const slugField = z
  .string()
  .min(2)
  .regex(/^[a-z0-9-]+$/, "أحرف إنجليزية صغيرة وأرقام وشرطات فقط");

export const productSchema = z.object({
  // Optional: employees generally never set this — the API auto-generates a
  // unique slug from the English title on create. Present only when an
  // admin deliberately opted into custom SEO editing via the form's
  // "تعديل يدوي" toggle.
  slug: slugField.optional(),
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
  negotiable: z.boolean(),
  area: z.string().nullable(),
  status: z.enum(productStatuses),
  visibility: z.enum(productVisibilities),
  whatsappContactNumberId: z.string().uuid().nullable(),
  callContactNumberId: z.string().uuid().nullable(),
  // alt may arrive empty from the form — the API route fills a generated
  // default before insert/update, so an empty string is valid input here
  // but never what ends up stored. order is not accepted from the client —
  // the API route stamps it from array position before insert/update.
  images: z.array(z.object({ url: z.string().url(), alt: z.string() })),
  specs: z.array(
    z.object({
      labelAr: z.string().min(1),
      labelEn: z.string().min(1),
      valueAr: z.string().min(1),
      valueEn: z.string().min(1),
    })
  ),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  slug: slugField,
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  image: z.string().url().nullable(),
  sortOrder: z.coerce.number().int(),
  hidden: z.boolean(),
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

export const contactNumberSchema = z.object({
  label: z.string().min(1),
  phoneE164: z.string().regex(/^\+\d{8,15}$/, "رقم غير صالح — استخدم صيغة دولية مثل +962791234567"),
  supportsWhatsapp: z.boolean(),
  supportsCall: z.boolean(),
  isDefault: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

export type ContactNumberInput = z.infer<typeof contactNumberSchema>;

export const businessSettingsSchema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  email: z.string().email(),
  experienceYears: z.string().min(1),
  addressAr: z.string().min(2),
  hoursAr: z.string().min(2),
});

export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>;

// Mirrors the mockup's own stated rule: "١٢ حرف على الأقل، وتحتوي أرقام
// ورموز" (at least 12 characters, containing digits and symbols).
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(12, "١٢ حرف على الأقل")
      .regex(/[0-9]/, "لازم تحتوي رقم واحد على الأقل")
      .regex(/[^A-Za-z0-9]/, "لازم تحتوي رمز واحد على الأقل"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
