import { Button, Card, Modal, Table } from "antd";
import type { Route } from "./+types/feedbacks";
import { db } from "~/database/client.server";
import type { Feedback } from "~/database/schema.server";
import { useMemo } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const feedbacks = await db.query.feedbacksTable.findMany();
  return { feedbacks };
}

export default function Page({
  loaderData: { feedbacks },
}: Route.ComponentProps) {
  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Phone Number",
        dataIndex: "phone",
        render: (value: string) => value ?? "N/A",
      },
      {
        title: "Action",
        id: "action",
        render: (_: any, data: Feedback) => (
          <div className="space-x-2">
            <Button
              type="primary"
              onClick={() => displayComment(data.comment)}
              size="small"
            >
              View Comment
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  function displayComment(comment: string) {
    Modal.info({
      title: "User Comment",
      content: comment,
    });
  }

  return (
    <Card title="Feedbacks">
      <Table scroll={{ x: 1000 }} columns={columns} dataSource={feedbacks} />
    </Card>
  );
}
