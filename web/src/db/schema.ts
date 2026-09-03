import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const productCategoryEnum = pgEnum("product_category", [
  "bedrooms",
  "salons",
  "offices",
  "appliances",
  "other",
]);

export const productConditionEnum = pgEnum("product_condition", [
  "excellent",
  "good",
  "fair",
]);

export const productStatusEnum = pgEnum("product_status", [
  "available",
  "reserved",
  "sold",
  "draft",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  category: productCategoryEnum("category").notNull(),
  condition: productConditionEnum("condition").notNull(),
  /** JOD, whole dinars. Null = "price on request". */
  price: integer("price"),
  /** One of lib/areas.ts's slugs, optional. */
  area: text("area"),
  status: productStatusEnum("status").notNull().default("available"),
  /** Vercel Blob URLs, in display order. */
  images: jsonb("images").$type<string[]>().notNull().default([]),
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

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
