import { calculateDiscount } from "~/lib/utils";
import { orderService } from "./order-service.server";
import { OrderStatus } from "~/lib/enums";
import { mailService } from "./mail-service.server";
import {
  ordersTable,
  productOrderTable,
  type Order,
  type User,
} from "~/database/schema.server";
import { paymentSuccessfulTemplate } from "~/mail-templates/payment-successful";
import { db } from "~/database/client.server";
import { productService } from "./product-service.server";

export type OrderItem = {
  id: string;
  quantity: number;
};

export const paymentService = {
  async makePayment(
    user: User,
    requestData: { items: OrderItem[]; address: string }
  ) {
    try {
      const items = requestData.items;
      const products = [];
      for (const item of items) {
        const product = await productService.findById(item.id);
        if (product) products.push({ ...product, quantity: item.quantity });
      }

      const deliveryAddress = requestData.address;

      const totalAmount = products.reduce(
        (cum, product) =>
          cum +
          product.quantity * calculateDiscount(product.price, product.discount),
        0
      );

      const txResponse = await db.transaction(async (tx) => {
        const order = (
          await tx
            .insert(ordersTable)
            .values({
              userId: user.id as string,
              status: OrderStatus.PENDING_PAYMENT,
              deliveryAddress,
            })
            .returning()
        )[0];

        for (const item of items) {
          const product = await productService.findById(item.id);
          if (product) {
            await tx.insert(productOrderTable).values({
              orderId: order.id,
              productId: product.id,
              price: product.price,
              quantity: item.quantity,
              discount: product.discount,
            });
          }
        }

        if (!order) {
          return { success: false };
        }

        const response = await fetch(
          "https://api.flutterwave.com/v3/payments",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
              "Content-Type": "application/json", // Tells the server you're sending JSON
            },
            body: JSON.stringify({
              tx_ref: order.id,
              // tx_ref: generateUnqueString("TRX"),
              amount: totalAmount,
              currency: process.env.CURRENCY,
              redirect_url: `${process.env.APP_URL}/checkout/payment_status`,
              customer: {
                email: user.email,
                name: user.name,
                phonenumber: "09011223344",
              },
              customizations: {
                title: process.env.APP_NAME,
              },
            }),
          }
        );

        return await response.json();
      });

      if (txResponse?.status === "success") {
        return { redirectUrl: txResponse.data.link, success: true };
      }

      console.log(txResponse);
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  },

  async verifyPayment(
    user: User,
    requestData: { txRef: string; transactionId: string }
  ) {
    const txRef = requestData.txRef;
    const transactionId = requestData.transactionId;

    if (!txRef || !transactionId) {
      return { success: false };
    }

    const order = await orderService.findById(txRef);

    if (!order) {
      return { success: false };
    }

    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const totalAmount = order.items.reduce(
      (cur, item) =>
        cur + item.quantity * calculateDiscount(item.price, item.discount),
      0
    );

    const data = await response.json();
    if (
      data.status === "success" &&
      data.data.status === "successful" &&
      data.data.charged_amount >= Math.round(totalAmount * 100) / 100
    ) {
      await orderService.markAsPaid(data.data.tx_ref, transactionId!);
      if (order.status === OrderStatus.PENDING_PAYMENT) {
        await mailService.sendMail(
          user.email,
          "Payment Successful",
          paymentSuccessfulTemplate(
            user.name,
            totalAmount,
            transactionId,
            order.createdAt.toDateString()
          )
        );
      }
      return { success: true };
    }
    return { success: false };
  },

  async verifyOrderPayment(order: Order) {
    try {
      if (order.status === OrderStatus.PENDING_DELIVERY) {
        const response = await fetch(
          `https://api.flutterwave.com/v3/transactions/${order.transactionId}/verify`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();

        if (responseData.status === "error" && responseData.data === null) {
          await orderService.markAsUnpaid(order.id);
        } else {
          const totalAmount = order.items.reduce(
            (cur, item) =>
              cur +
              item.quantity * calculateDiscount(item.price, item.discount),
            0
          );

          if (
            totalAmount &&
            responseData.data.charged_amount < Number(totalAmount.toFixed(2))
          ) {
            await orderService.markAsUnpaid(order.id);
          }
        }

        const validatedOrder = await db.query.ordersTable.findFirst({
          where: (t, fn) => fn.eq(t.id, order.id),
          with: { items: { with: { product: true } } },
        });

        return { success: true, data: validatedOrder };
      }
    } catch (error) {
      return { success: false };
    }
  },
};
