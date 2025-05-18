import { Card, Table } from "antd";
import { useMemo } from "react";
import type { Route } from "./+types/customers";
import { userService } from "~/services/user-service.server";
import { UserType } from "~/lib/enums";

export async function loader() {
  const customers = await userService.findByType(UserType.CUSTOMER);
  return { customers };
}

export default function Page({
  loaderData: { customers },
}: Route.ComponentProps) {
  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Email Address",
        dataIndex: "email",
      },
      {
        title: "Phone Number",
        dataIndex: "phone",
        render: (value: string) => value ?? "N/A",
      },
      {
        title: "Date Joined",
        dataIndex: "createdAt",
        render: (value: string) => new Date(value).toDateString(),
      },
    ],
    []
  );

  return (
    <Card title="Customers">
      <Table
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={customers}
      />
    </Card>
  );
}
