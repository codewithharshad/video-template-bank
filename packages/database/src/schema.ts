import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type UserPlan = "free" | "creator" | "pro";
export type UserRole = "user" | "admin";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  credits: integer("credits").notNull().default(20),
  plan: text("plan").notNull().default("free").$type<UserPlan>(),
  role: text("role").notNull().default("user").$type<UserRole>(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const exports = pgTable("exports", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  templateSlug: text("template_slug").notNull(),
  templateName: text("template_name").notNull(),
  format: text("format").notNull(),
  resolution: text("resolution").notNull(),
  transparent: boolean("transparent").notNull().default(false),
  blobUrl: text("blob_url").notNull(),
  blobPathname: text("blob_pathname").notNull(),
  fileSize: integer("file_size"),
  inputProps: jsonb("input_props").$type<Record<string, string | number>>(),
  creditsUsed: integer("credits_used").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const creditTransactions = pgTable("credit_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  exportId: uuid("export_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const catalogTemplates = pgTable("catalog_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  templateKind: text("template_kind").notNull().$type<"hook" | "overlay">(),
  compositionId: text("composition_id").notNull(),
  published: boolean("published").notNull().default(false),
  metadata: jsonb("metadata").notNull().$type<Record<string, unknown>>(),
  previewImageUrl: text("preview_image_url"),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Export = typeof exports.$inferSelect;
export type CatalogTemplate = typeof catalogTemplates.$inferSelect;
