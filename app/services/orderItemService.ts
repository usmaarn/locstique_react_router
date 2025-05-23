import { db, type TX } from "~/database/db.server";
import {
  productOrderTable,
  type Order,
  type Product,
} from "~/database/schema.server";

export type CreateOrderItemDto = {
  product: Product;
  order: Order;
  quantity: number;
};

class OrderItemService {
  async create(tx: TX, { order, product, quantity }: CreateOrderItemDto) {
    const result = await tx
      .insert(productOrderTable)
      .values({
        orderId: order.id,
        productId: product.id,
        price: product.price,
        quantity,
        discount: product.discount,
      })
      .returning();
    return result[0];
  }
}

export const orderItemService = new OrderItemService();
