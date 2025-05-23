import { db, type TX } from "~/database/db.server";
import {
  ordersTable,
  type Order,
  type ProductOrder,
  type User,
} from "~/database/schema.server";
import { eq } from "drizzle-orm";
import { OrderStatus } from "~/lib/enums";
import { productService } from "./product-service.server";
import { orderItemService } from "./orderItemService";
import type { OrderItemDto } from "~/lib/types";

type OrderDto = {
  user: User;
  deliveryAddress: string;
};

class OrderService {
  async create(tx: TX, dto: OrderDto) {
    const result = await tx
      .insert(ordersTable)
      .values({
        userId: dto.user.id as string,
        status: OrderStatus.PENDING_PAYMENT,
        deliveryAddress: dto.deliveryAddress,
      })
      .returning();
    return result[0];
  }

  async findById(orderId: string) {
    return db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, orderId),
      with: { items: { with: { product: true } } },
    });
  }

  async markAsPaid(orderId: string, transactionId: string) {
    await db
      .update(ordersTable)
      .set({
        status: OrderStatus.PENDING_DELIVERY,
        transactionId,
      })
      .where(eq(ordersTable.id, orderId));
  }

  async markAsDelivered(orderId: string) {
    await db
      .update(ordersTable)
      .set({
        status: OrderStatus.DELIVERED,
      })
      .where(eq(ordersTable.id, orderId));
  }

  async markAsUnpaid(orderId: string) {
    await db
      .update(ordersTable)
      .set({
        status: OrderStatus.PENDING_PAYMENT,
      })
      .where(eq(ordersTable.id, orderId))
      .returning();
  }

  async addItems(tx: TX, order: Order, items: OrderItemDto[]) {
    const result: ProductOrder[] = [];
    for (const item of items) {
      const product = await productService.findById(item.productId);

      if (product) {
        const orderItem = await orderItemService.create(tx, {
          order,
          product,
          quantity: item.quantity,
        });
        result.push(orderItem);
      }
    }
    return result;
  }

  async queryOrders(query: any) {
    const size = query?.size ? parseInt(query.size) : undefined;
    const page = query?.page ? parseInt(query.page) : undefined;

    return await db.query.ordersTable.findMany({
      limit: size,
      offset: page && size ? (page > 1 ? page - 1 : 1) * size : undefined,
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });
  }
}

export const orderService = new OrderService();
