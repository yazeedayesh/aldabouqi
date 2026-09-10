import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const productConditionEnum = pgEnum("product_condition", [
  "excellent",
  "good",
  "fair",
]);

// "draft" remains a valid Postgres enum value for backward compatibility
// with any pre-migration row, but the app no longer writes it here — a
// product's publish state now lives in `visibility` below (admin v2 brief,
// 2026-09-08), and this column is availability only going forward.
export const productStatusEnum = pgEnum("product_status", [
  "available",
  "reserved",
  "sold",
  "draft",
]);

export const productVisibilityEnum = pgEnum("product_visibility", [
  "published",
  "hidden",
  "draft",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
]);

/** order is stamped by the server from array position on every save — the
 * lowest order value is the primary/display image everywhere on the site.
 * Not user-editable directly; reordering in the admin form just reorders
 * the array, and the API recomputes order to match before saving. */
export type ProductImage = { url: string; alt: string; order: number };

export type ProductSpec = { labelAr: string; labelEn: string; valueAr: string; valueEn: string };

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  /** Vercel Blob URL, optional (category tile icon/photo). */
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
  /** Hidden = removed from nav/homepage/category filters immediately, but the
   * category's own /store/{slug} page and its products stay reachable —
   * same "hidden ≠ deleted" semantics as product visibility. */
  hidden: boolean("hidden").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactNumbers = pgTable("contact_numbers", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  phoneE164: text("phone_e164").notNull(),
  supportsWhatsapp: boolean("supports_whatsapp").notNull().default(true),
  supportsCall: boolean("supports_call").notNull().default(true),
  /** Exactly one row should be true — enforced in the API layer (unsetting
   * the previous default) rather than a DB constraint, since Postgres has
   * no simple "at most one true" constraint without a partial unique index
   * this project doesn't otherwise need. */
  isDefault: boolean("is_default").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  // References categories.slug rather than categories.id so admin-authored
  // slugs stay human-readable in this column; onDelete: restrict means a
  // category with products still on it can't be deleted (enforced by
  // Postgres, not just the app layer).
  category: text("category")
    .notNull()
    .references(() => categories.slug, { onDelete: "restrict" }),
  condition: productConditionEnum("condition").notNull(),
  /** JOD, whole dinars. Null = "price on request" — also hides the
   * checkout/COD option on the product page (product page gates that
   * button on price != null already). */
  price: integer("price"),
  negotiable: boolean("negotiable").notNull().default(false),
  /** One of lib/areas.ts's slugs, optional. */
  area: text("area"),
  /** Availability only (admin v2 brief, 2026-09-08) — publish state moved
   * to `visibility` below. */
  status: productStatusEnum("status").notNull().default("available"),
  visibility: productVisibilityEnum("visibility").notNull().default("published"),
  /** Per-product contact override — null means "use the default row in
   * contact_numbers". onDelete: set null so deleting a non-default number
   * never breaks a product, it just falls back to the default. */
  whatsappContactNumberId: uuid("whatsapp_contact_number_id").references(() => contactNumbers.id, {
    onDelete: "set null",
  }),
  callContactNumberId: uuid("call_contact_number_id").references(() => contactNumbers.id, {
    onDelete: "set null",
  }),
  /** Vercel Blob URLs with per-image alt text, in display order — the first
   * entry is the primary/display image everywhere on the site. */
  images: jsonb("images").$type<ProductImage[]>().notNull().default([]),
  /** (label, value) pairs, ar/en — the spec table is hidden entirely on the
   * product page when this is empty, never shown with placeholder rows. */
  specs: jsonb("specs").$type<ProductSpec[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  area: text("area"),
  notes: text("notes"),
  status: orderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Logged when a visitor clicks a WhatsApp CTA on a product, purely so the
// admin dashboard's "recent inquiries" list is real data. Deliberately no
// customer name/phone/message — that conversation happens inside WhatsApp
// itself, this table only records that interest happened.
export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  productTitleAr: text("product_title_ar").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Singleton (id is always the literal string "default") — admin-editable
// business info that used to be a hardcoded constant. Reflected on the
// footer and LocalBusiness schema everywhere (admin v2 brief, 2026-09-08).
export const businessSettings = pgTable("business_settings", {
  id: text("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  email: text("email").notNull(),
  /** Display string, e.g. "+٦٠" — not a number, since it's shown verbatim. */
  experienceYears: text("experience_years").notNull(),
  addressAr: text("address_ar").notNull(),
  hoursAr: text("hours_ar").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Singleton admin account (id is always "admin") — replaces the earlier
// ADMIN_USERNAME/ADMIN_PASSWORD_HASH env vars so "change password" can be a
// real, server-verified action instead of requiring a redeploy (admin v2
// brief, 2026-09-08: "التحقق من الحالية إلزامي سيرفر-سايد").
export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// One row per login. `id` is embedded in the session JWT as a claim and
// checked on every request (see src/auth.ts) — this is what makes "sign out
// of all devices" and the active-session count real instead of decorative,
// without switching NextAuth off JWT sessions entirely.
export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  revoked: boolean("revoked").notNull().default(false),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type ContactNumber = typeof contactNumbers.$inferSelect;
export type NewContactNumber = typeof contactNumbers.$inferInsert;
export type BusinessSettings = typeof businessSettings.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
