import { Button, Card, Table, Tag } from "antd";
import { OrderStatus } from "~/lib/enums";
import { Link, useLoaderData } from "react-router";
import type { Order } from "~/database/schema.server";

const columns = [
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
          return <Tag>PENDING DELIVERY</Tag>;
        case OrderStatus.DELIVERED:
          return <Tag color="green">DELIVERED</Tag>;
        default:
          return <Tag color="">UNKNOWN</Tag>;
      }
    },
  },
  {
    title: "Action",
    render: (_: any, row: Order) => (
      <div className="">
        <Link to={`/orders/${row.id}`}>
          <Button type="primary" size="small">
            View Details
          </Button>
        </Link>
      </div>
    ),
  },
];

const RecentOrders = () => {
  const { recentOrders } = useLoaderData();

  return (
    <Card title="Recent Orders">
      <Table
        size="small"
        scroll={{ x: 1000 }}
        dataSource={recentOrders}
        columns={columns}
      />
    </Card>
  );
};

export default RecentOrders;
