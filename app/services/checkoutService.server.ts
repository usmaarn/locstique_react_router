import { db } from "~/database/db.server";
import { orderService } from "./orderService.server";
import type { User } from "~/database/schema.server";
import { calculateTotalAmount } from "~/lib/utils";
import { paystackPaymentService } from "./paystackPaymentService";
import type { OrderItemDto } from "~/lib/types";

type CheckoutDto = {
  user: User;
  deliveryAddress: string;
  items: OrderItemDto[];
};

class CheckoutService {
  async processCheckout({ user, deliveryAddress, items }: CheckoutDto) {
    const response = await db.transaction(async (tx) => {
      const order = await orderService.create(tx, { user, deliveryAddress });

      const products = await orderService.addItems(tx, order, items);

      const totalAmount = calculateTotalAmount(
        products.map((p) => ({
          price: p.price,
          discount: p.discount,
          quantity: p.quantity,
        }))
      );

      const response = await paystackPaymentService.makePayment({
        user,
        amount: totalAmount,
      });
      return response;
    });
    return response;
  }
}

export const checkoutService = new CheckoutService();
