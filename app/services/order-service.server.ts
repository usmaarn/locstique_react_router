import { db } from "~/database/index.server";
import { ordersTable, productOrderTable } from "~/database/schema.server";
import { OrderStatus } from "~/lib/enums";
import { eq } from "drizzle-orm";

export const orderService = {
  async findById(orderId: string) {
    return db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, orderId),
      with: { items: { with: { product: true } } },
    });
  },

  async markAsPaid(orderId: string, transactionId: string) {
    await db
      .update(ordersTable)
      .set({
        status: OrderStatus.PENDING_DELIVERY,
        transactionId,
      })
      .where(eq(ordersTable.id, orderId));
  },

  async markAsDelivered(orderId: string) {
    await db
      .update(ordersTable)
      .set({
        status: OrderStatus.DELIVERED,
      })
      .where(eq(ordersTable.id, orderId));
  },

  async markAsUnpaid(orderId: string) {
    await db
      .update(ordersTable)
      .set({
        status: OrderStatus.PENDING_PAYMENT,
      })
      .where(eq(ordersTable.id, orderId))
      .returning();
  },

  async addItem(orderId: string, dto: any) {
    let result = await db
      .insert(productOrderTable)
      .values({
        orderId,
        ...dto,
      })
      .returning();

    return result[0];
  },

  async queryOrders(query: any) {
    const size = query?.size ? parseInt(query.size) : undefined;
    const page = query?.page ? parseInt(query.page) : undefined;

    return await db.query.ordersTable.findMany({
      limit: size,
      offset: page && size ? (page > 1 ? page - 1 : 1) * size : undefined,
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });
  },
};
