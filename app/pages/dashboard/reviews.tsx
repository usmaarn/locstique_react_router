import ImageUpload from "~/components/image-upload";
import { getImageSrc, setFieldErrors } from "~/lib/utils";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Modal,
  Table,
  Typography,
} from "antd";

import { useEffect, useMemo, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types";
import type { Review } from "~/database/schema.server";
import { reviewService } from "~/services/review-service.server";
import { z } from "zod";
import { validateSchema } from "~/lib/helper.server";

export async function loader() {
  const reviews = await reviewService.queryReviews({});
  return { reviews };
}

export async function action({ request }: Route.ActionArgs) {
  const data = await request.json();

  if (request.method === "DELETE") {
    const review = await reviewService.findById(data.id);
    if (review) {
      await reviewService.deleteReview(review);
      return { message: "Review deleted!" };
    }
    return { error: "Unable to delete review" };
  }

  const schema = z.object({
    user: z.string().min(1, "User is required"),
    image: z.string().min(1, "Image is required"),
    title: z.string().min(1, "Title is required"),
    comment: z.string().min(1, "Comment is required"),
  });

  const validated = await validateSchema(schema, data);
  if (validated.errors) {
    return { errors: validated.errors };
  }

  const result = await reviewService.create(validated.data);
  return { message: "review !created", created: true };
}

export default function Page({
  loaderData: { reviews },
}: Route.ComponentProps) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const loading = fetcher.state != "idle";

  const [form] = Form.useForm();

  const columns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "image",
        render: (value: string) => (
          <Image width={30} src={getImageSrc(value)} alt="" />
        ),
      },
      {
        title: "Name",
        dataIndex: "user",
      },
      {
        title: "Title",
        dataIndex: "title",
      },
      {
        title: "Comment",
        dataIndex: "comment",
        render: (value: string) => value ?? "N/A",
      },
      {
        title: "Action",
        id: "action",
        render: (_: any, value: Review) => (
          <div className="space-x-2">
            <Button onClick={() => deleteReview(value)} size="small" danger>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  function deleteReview(review: Review) {
    Modal.confirm({
      title: "Delete Review",
      content: "Are you sure you want to delete review",
      okButtonProps: { loading },
      onOk: async () =>
        fetcher.submit(
          { id: review.id },
          { method: "DELETE", encType: "application/json" }
        ),
    });
  }

  useEffect(() => {
    if (fetcher.data?.message) {
      setOpen(false);
      message.success(fetcher.data.message);
    }
    if (fetcher.data?.error) {
      message.error(fetcher.data.error);
    }

    if (fetcher.data?.errors) {
      setFieldErrors(form, fetcher.data?.errors);
    }
  }, [fetcher.data]);

  return (
    <>
      <Modal
        title="Add Review"
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        okText="Submit"
        onOk={form.submit}
        okButtonProps={{ loading }}
      >
        <Form
          form={form}
          labelCol={{ sm: 5 }}
          onFinish={(v) =>
            fetcher.submit(v, { method: "POST", encType: "application/json" })
          }
        >
          <Form.Item label="User" name="user" rules={[{ required: true }]}>
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item label="Image" name="image" rules={[{ required: true }]}>
            <ImageUpload
              maxCount={1}
              onChange={(e) =>
                form.setFieldValue("image", e[0].response ?? e[0].uid)
              }
            />
          </Form.Item>
          <Form.Item label="title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="Comment"
            name="comment"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Title" />
          </Form.Item>
        </Form>
      </Modal>

      <Card
        title={
          <div className="flex items-center justify-between">
            <Typography.Title level={5}>Reviews</Typography.Title>
            <Button type="primary" onClick={() => setOpen(true)}>
              Add Review
            </Button>
          </div>
        }
      >
        <Table
          size="small"
          loading={loading}
          scroll={{ x: 1000 }}
          columns={columns}
          dataSource={reviews}
        />
      </Card>
    </>
  );
}
