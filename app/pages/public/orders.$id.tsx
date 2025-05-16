import { orderService } from "~/services/order-service";
import type { Route } from "./+types";
import { paymentService, type OrderItem } from "~/services/payment-service";
import { data } from "react-router";
import { Avatar, Card, Col, Input, List, Row, Space, Tag } from "antd";
import { calculateDiscount, getImageSrc } from "~/lib/utils";
import { OrderStatus } from "~/lib/enums";
import { PriceFormat } from "~/components/price-format";

export async function loader({ params }: Route.LoaderArgs) {
  const order = await orderService.findById(params.id!);
  if (order) {
    const response = await paymentService.verifyOrderPayment(order);
    if (response?.success) {
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
    <Row gutter={[24, 24]} className="p-3 max-w-6xl! mx-auto!">
      <Col span={24}>
        <h2 className="md:col-span-3 text-2xl font-bold">Order Details</h2>
      </Col>
      <Col span={24} md={16}>
        <Space direction="vertical" className="w-full!">
          <Card
            title="Order Items"
            className="bg-gray-50!"
            classNames={{ body: "p-0!" }}
          >
            <List
              size="small"
              dataSource={order.items}
              renderItem={(item: OrderItem, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={getImageSrc(item.product.images[0])}
                        shape="square"
                        size="large"
                      />
                    }
                    title={item.product.name}
                    description={<p>QTY: {item.quantity}</p>}
                  />
                </List.Item>
              )}
            />
          </Card>
          <Card title="Delivery Address" className="bg-gray-50!">
            <Input.TextArea
              placeholder="Enter delivery address"
              readOnly
              disabled
              value={order.deliveryAddress!}
              name="address"
            />
          </Card>
        </Space>
      </Col>

      <Col span={24} md={8}>
        <Card
          title="Order Summary"
          className="bg-gray-50!"
          classNames={{ body: "space-y-2" }}
        >
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
        </Card>
      </Col>
    </Row>
  );
}
