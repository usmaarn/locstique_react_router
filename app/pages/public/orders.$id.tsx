import { orderService } from "~/services/order-service";
import type { Route } from "./+types";
import { paymentService } from "~/services/payment-service";
import { data } from "react-router";
import { Input, Tag } from "antd";
import { calculateDiscount } from "~/lib/utils";
import { OrderStatus } from "~/lib/enums";
import {
  ProductImage,
  ProductProvider,
  ProductTitle,
} from "~/components/product";
import { PriceFormat } from "~/components/price-format";

export async function loader({ params }: Route.LoaderArgs) {
  const order = await orderService.findById(params.id!);
  if (order) {
    const response = await paymentService.verifyOrderPayment(order);
    if (response?.success) {
      console.log(response?.data);
      return { order: response.data };
    }
    return { order: { ...order, status: 0 } };
  }
  return data({ message: "Order not found" }, 404);
}

export default function Page({ loaderData: { order } }: Route.ComponentProps) {
  const totalAmount = order.items.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0
  );

  const totalItems = order.items.reduce(
    (total: number, item: any) => item + item.quantity,
    0
  );
  const deliveryFee = 0;
  const discountAmount = order.items.reduce(
    (total: number, item: any) =>
      total + (item.price - calculateDiscount(item.price, item.discount)),
    0
  );
  const discountPercentage = (discountAmount / totalAmount) * 100;

  function displayStatus(status: string) {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return <Tag color="red">PENDING PAYMENT</Tag>;
      case OrderStatus.PENDING_DELIVERY:
        return <Tag color="blue">PENDING DELIVERY</Tag>;
      case OrderStatus.DELIVERED:
        return <Tag color="green">DELIVERED</Tag>;
      default:
        return <Tag>UNKNOWN</Tag>;
    }
  }

  return (
    <div className="p-3 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
      <h2 className="md:col-span-3 text-2xl font-bold">Order Details</h2>
      <div className="space-y-5 md:col-span-2">
        <div className="border rounded-2xl bg-gray-50">
          <h3 className="font-bold px-5 py-3 border-b">Order Items</h3>
          <div className="px-5 py-3 space-y-2">
            {order.items.map((item: any, index: number) => (
              <ProductProvider key={index} product={item.product}>
                <div
                  key={item.product.id}
                  className="border bg-gray-100 rounded-2xl p-2 flex gap-3"
                >
                  <div className="">
                    <ProductImage size={50} />
                  </div>
                  <div className="text-sm space-y-1">
                    <h3>
                      <ProductTitle />
                    </h3>
                    <p>QTY: {item.quantity}</p>
                  </div>
                </div>
              </ProductProvider>
            ))}
          </div>
        </div>

        <div className="border rounded-2xl bg-gray-50">
          <h3 className="font-bold px-5 py-3 border-b">Delivery Address</h3>
          <div className="px-5 py-3 space-y-2">
            <Input.TextArea
              placeholder="Enter delivery address"
              readOnly
              disabled
              value={order.deliveryAddress!}
              name="address"
              className="bg-white"
            />
          </div>
        </div>
      </div>

      <div className="">
        <div className="border rounded-2xl bg-gray-50">
          <h3 className="font-bold px-5 py-3 border-b">Order Summary</h3>
          <div className="px-5 py-3 space-y-2">
            <div className="flex justify-between">
              <p>
                {"Item's Total"} ({totalItems})
              </p>
              <PriceFormat value={totalAmount} />
            </div>
            <div className="flex justify-between">
              <p>Delivery Fee</p>
              <PriceFormat value={deliveryFee} />
            </div>
            <div className="flex justify-between">
              <p>Discount({discountPercentage.toFixed(1)}%)</p>
              <PriceFormat value={discountAmount} />
            </div>

            <div className="flex justify-between border-t pt-3 font-bold">
              <p>Total</p>
              <PriceFormat value={totalAmount - discountAmount} />
            </div>

            <div className="flex justify-between border-t pt-3">
              <p className="font-bold">Status</p>
              <p className="font-bold">{displayStatus(order.status!)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
