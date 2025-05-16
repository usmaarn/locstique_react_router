import { db } from "@/database";
import { cartsTable } from "@/database/schema.ts";
import { and, eq } from "drizzle-orm";

export const cartService = {
  getItems: async (userId: string) => {
    const items = await db.query.cartsTable.findMany({
      where: (t, fn) => fn.eq(t.userId, userId),
      with: { product: true },
    });
    return items;
  },

  addItem: async (
    userId: string,
    dto: { productId: string; quantity: number }
  ) => {
    const result = await db
      .insert(cartsTable)
      .values({
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      })
      .onConflictDoUpdate({
        target: [cartsTable.productId, cartsTable.userId],
        set: { quantity: dto.quantity },
      })
      .returning();
    return result[0];
  },

  removeItem: async (userId: string, productId: string) => {
    await db
      .delete(cartsTable)
      .where(
        and(eq(cartsTable.userId, userId), eq(cartsTable.productId, productId))
      );
  },

  clear: async (userId: string) => {
    await db.delete(cartsTable).where(eq(cartsTable.userId, userId));
  },
};
