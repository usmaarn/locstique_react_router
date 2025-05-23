import { orderService } from "~/services/orderService.server";
import type { Route } from "./+types/orders";
import { Card, Table, Tag } from "antd";
import { ButtonLink } from "~/components/link";
import type { Order } from "~/database/schema.server";
import { OrderStatus } from "~/lib/enums";
import { useMemo } from "react";

export async function loader({}: Route.LoaderArgs) {
  const orders = await orderService.queryOrders({});
  return { orders };
}

export default function Page({ loaderData: { orders } }: Route.ComponentProps) {
  const columns = useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "id",
      },
      {
        title: "Transaction ID",
        dataIndex: "transactionId",
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (value: string) => {
          switch (value) {
            case OrderStatus.PENDING_PAYMENT:
              return <Tag color="red">PENDING PAYMENT</Tag>;
            case OrderStatus.PENDING_DELIVERY:
              return <Tag color="blue">PENDING DELIVERY</Tag>;
            case OrderStatus.DELIVERED:
              return <Tag color="green">DELIVERED</Tag>;
            default:
              return <Tag color="blue">UNKNOWN</Tag>;
          }
        },
      },
      {
        title: "Action",
        render: (_: any, data: Order) => (
          <div className="">
            <ButtonLink
              type="primary"
              size="small"
              className="hover:underline"
              to={`/orders/${data.id}`}
            >
              Details
            </ButtonLink>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card title="Orders">
      <Table
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={orders}
      />
    </Card>
  );
}
