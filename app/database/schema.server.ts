import {
  doublePrecision,
  integer,
  json,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { OrderStatus, UserType } from "~/lib/enums";
import { generateUnqueString } from "~/lib/helper.server";
import { v7 as uuidV7 } from "uuid";

export const usersTable = pgTable("users", {
  id: varchar("id").primaryKey().$defaultFn(uuidV7),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique("users_email_idx"),
  phone: varchar("phone", { length: 20 }).unique("users_phone_idx"),
  avatar: varchar("avatar"),
  type: text("type").notNull().default(UserType.CUSTOMER),
  password: varchar("password").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessionsTable = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const productsTable = pgTable("products", {
  id: varchar("id").primaryKey().$defaultFn(uuidV7),
  name: varchar("name").unique("product_name_idx").notNull(),
  details: text("details").notNull().default(""),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  discount: doublePrecision("discount").notNull().default(0),
  images: json("images").notNull().default([]),
  stock: integer("stock").notNull().default(0),
  tag: varchar("tag").default("🎁 BUY 1, GET 1 FREE HOLIDAY SALE 🎁"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const cartsTable = pgTable(
  "carts",
  {
    userId: varchar("user_id")
      .references(() => usersTable.id)
      .notNull(),
    productId: varchar("product_id")
      .references(() => productsTable.id)
      .notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ name: "cart_id", columns: [t.productId, t.userId] })]
);

export const ordersTable = pgTable("orders", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateUnqueString("TRN_")),
  userId: varchar("user_id")
    .references(() => usersTable.id)
    .notNull(),
  status: varchar("status", { length: 10 }).default(
    OrderStatus.PENDING_PAYMENT
  ),
  transactionId: varchar("transaction_id"),
  deliveryAddress: varchar("delivery_address"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productOrderTable = pgTable(
  "product_order",
  {
    orderId: varchar("order_id")
      .references(() => ordersTable.id)
      .notNull(),
    productId: varchar("product_id")
      .references(() => productsTable.id)
      .notNull(),
    price: doublePrecision("price").notNull(),
    discount: doublePrecision("discount").notNull().default(0),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ name: "product_order_id", columns: [t.productId, t.orderId] }),
  ]
);

export const subscribersTable = pgTable("subscribers", {
  id: varchar("id").primaryKey().$defaultFn(uuidV7),
  email: varchar("email").notNull().unique("subscribers_email_idx"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const feedbacksTable = pgTable("feedbacks", {
  id: varchar("id").primaryKey().$defaultFn(uuidV7),
  name: varchar("name"),
  email: varchar("email"),
  phone: varchar("phone"),
  comment: varchar("comment").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const settingsTable = pgTable("settings", {
  id: varchar("id").primaryKey().$defaultFn(uuidV7),
  name: varchar("name").notNull().unique("settings_name_idx"),
  value: jsonb("value"),
  comment: varchar("comment"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reviewsTable = pgTable("reviews", {
  id: varchar("id").primaryKey().$defaultFn(uuidV7),
  user: varchar("user").notNull(),
  image: varchar("image"),
  title: varchar("title").notNull(),
  comment: varchar("comment"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = InferSelectModel<typeof productsTable>;
export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
export type ProductOrder = InferSelectModel<typeof productOrderTable>;
export type Feedback = InferSelectModel<typeof feedbacksTable>;
export type Subscriber = InferSelectModel<typeof subscribersTable>;
export type Review = InferSelectModel<typeof reviewsTable>;
export type Order = InferSelectModel<typeof ordersTable> & {
  items: ProductOrder[];
};
