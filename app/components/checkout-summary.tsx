import { Button, Card } from "antd";
import { PriceFormat } from "./price-format";
import { useLoaderData } from "react-router";
import type { CartItem } from "~/lib/types";
import { calculateDiscount } from "~/lib/utils";

const CheckoutSummary = ({ loading }: { loading: boolean }) => {
  const { items }: { items: CartItem[] } = useLoaderData();

  const totalItems = items.reduce((prev, cur) => prev + cur.quantity, 0);
  const deliveryFee = 0;

  const discountAmount = items.reduce(
    (cum, item) =>
      cum +
      (item.price - calculateDiscount(item.price, item.discount)) *
        item.quantity,
    0
  );

  const totalAmount = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const total = deliveryFee + totalAmount - discountAmount;
  const discountPercentage = (discountAmount / totalAmount) * 100;

  return (
    <Card title="Order Summary" className="bg-gray-50!">
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
        <p>
          Discount(
          <PriceFormat
            prefix=""
            suffix="%"
            decimalScale={0}
            value={discountPercentage}
          />
          )
        </p>
        <PriceFormat value={discountAmount} />
      </div>

      <div className="flex justify-between border-t pt-3">
        <p className="font-bold">Total</p>
        <PriceFormat value={total} />
      </div>

      <Button
        // onClick={}
        className="w-full mt-8"
        loading={loading}
        htmlType="submit"
        size="large"
        type="primary"
      >
        Checkout
      </Button>
    </Card>
  );
};

export default CheckoutSummary;
