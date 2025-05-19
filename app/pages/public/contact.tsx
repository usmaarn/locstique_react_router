import type { Route } from "./+types/contact";
import { settingsService } from "~/services/settings-service.server";
import { productService } from "~/services/product-service.server";
import { Button, Col, Form, Input, Modal, Row, Typography } from "antd";
import { config } from "~/lib/config";
import { SendOutlined } from "@ant-design/icons";
import { z } from "zod";
import { validateSchema } from "~/lib/helper.server";
import { db } from "~/database/db.server";
import { feedbacksTable } from "~/database/schema.server";
import { setFieldErrors } from "~/lib/utils";
import { useFetcher } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Locstique | Contact Us" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const settings = await settingsService.get("home_page");
  const featuredProducts = await productService.queryProducts({ size: 4 });
  return { settings: settings?.value ?? {}, featuredProducts };
}

export async function action({ request }: Route.ActionArgs) {
  const data = await request.json();

  const schema = z.object({
    name: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    comment: z.string().min(5),
  });

  const validated = await validateSchema(schema, data);
  if (validated.errors) {
    return { errors: validated.errors };
  }

  await db.insert(feedbacksTable).values({
    name: validated.data.name,
    email: validated.data.email,
    phone: validated.data.phone,
    comment: validated.data.comment,
  });

  return { success: true };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [form] = Form.useForm();
  const fetcher = useFetcher();

  useEffect(() => {
    setFieldErrors(form, fetcher.data?.errors);

    if (fetcher.data?.success) {
      Modal.success({
        title: "Message Sent",
        content: (
          <div>
            <Typography.Paragraph>
              Your message has been sent successfully!, We will get in touch as
              soon as possible if need be.
            </Typography.Paragraph>
            <Typography.Paragraph>Have a nice day.</Typography.Paragraph>
          </div>
        ),
      });
      form.resetFields();
    }
  }, [fetcher.data]);

  return (
    <div className="max-w-2xl mx-auto space-y-5 px-4 py-16">
      <Typography.Title level={4} className="text-2xl font-bold text-center">
        Get in Touch. We're Here to Help!
      </Typography.Title>
      <Typography.Paragraph className=" text-gray-500! text-center">
        At {config.appName}, your satisfaction is our top priority. We encourage
        you to reach out with any questions, concerns, or feedback, as our
        dedicated team is always eager to assist you. Whether you need help with
        product inquiries or simply want to share your experience with us, we're
        just a message away.{" "}
      </Typography.Paragraph>
      <Form
        form={form}
        onFinish={(v) =>
          fetcher.submit(v, { method: "POST", encType: "application/json" })
        }
      >
        <Row gutter={12}>
          <Col span={24} md={12}>
            <Form.Item name="name" rules={[{ required: true }]}>
              <Input placeholder="Full Name" />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="email" rules={[{ required: true }]}>
              <Input type="email" placeholder="Email Address" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="phone" rules={[{ required: true }]}>
          <Input type="tel" placeholder="Phone Number" />
        </Form.Item>

        <Form.Item name="comment" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Message" />
        </Form.Item>

        <Button
          loading={fetcher.state != "idle"}
          type="primary"
          htmlType="submit"
        >
          Send Comment <SendOutlined />
        </Button>
      </Form>
    </div>
  );
}
