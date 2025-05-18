import { relations } from "drizzle-orm";
import {
  cartsTable,
  ordersTable,
  productOrderTable,
  productsTable,
  reviewsTable,
  usersTable,
} from "./schema.server";

export const productRelations = relations(productsTable, ({ one, many }) => ({
  carts: many(cartsTable),
  // reviews: many(reviewsTable),
}));

export const cartRelations = relations(cartsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [cartsTable.userId],
    references: [usersTable.id],
  }),
  product: one(productsTable, {
    fields: [cartsTable.productId],
    references: [productsTable.id],
  }),
}));

export const orderRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id],
  }),
  items: many(productOrderTable),
}));

export const productOrderRelations = relations(
  productOrderTable,
  ({ one }) => ({
    order: one(ordersTable, {
      fields: [productOrderTable.orderId],
      references: [ordersTable.id],
    }),
    product: one(productsTable, {
      fields: [productOrderTable.productId],
      references: [productsTable.id],
    }),
  })
);
