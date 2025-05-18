import { Space } from "antd";
import { and, eq, ne, sql } from "drizzle-orm";
import { SectionCards } from "~/components/dashboard/section-card";
import { db } from "~/database/index.server";
import {
  ordersTable,
  productOrderTable,
  productsTable,
  usersTable,
} from "~/database/schema.server";
import { OrderStatus, UserType } from "~/lib/enums";
import type { Route } from "./+types/index";
import { ChartTable } from "~/components/dashboard/chart-table";
import { orderService } from "~/services/order-service.server";
import RecentOrders from "~/components/dashboard/recent-orders";

export async function loader({}: Route.LoaderArgs) {
  const revenue = await db
    .select({
      totalAmount: sql<number>`
      SUM((${productOrderTable.price} - (${productOrderTable.price} * ${productOrderTable.discount} / 100)) * ${productOrderTable.quantity})
    `.as("totalAmount"),
    })
    .from(productOrderTable)
    .innerJoin(ordersTable, eq(productOrderTable.orderId, ordersTable.id))
    .where(and(ne(ordersTable.status, OrderStatus.PENDING_PAYMENT)));
  const productsCount = await db
    .select({ count: sql<number>`COUNT(*)`.as("count") })
    .from(productsTable);
  const customersCount = await db
    .select({ count: sql<number>`COUNT(*)`.as("count") })
    .from(usersTable)
    .where(eq(usersTable.type, UserType.CUSTOMER));

  return {
    revenue: revenue[0].totalAmount,
    productsCount: productsCount[0]?.count ?? 0,
    customersCount: customersCount[0]?.count ?? 0,
    recentOrders: await orderService.queryOrders({ size: 5 }),
  };
}

export default function Page() {
  return (
    <Space direction="vertical" className="w-full">
      <SectionCards />
      <ChartTable />
      <RecentOrders />
    </Space>
  );
}
