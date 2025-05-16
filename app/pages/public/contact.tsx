import type { Route } from "./+types";
import { settingsService } from "~/services/settings-service";
import { productService } from "~/services/product-service";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { config } from "~/lib/config";
import { SendOutlined } from "@ant-design/icons";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Locstique | Contact Us" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const settings = await settingsService.get("home_page");
  const featuredProducts = await productService.queryProducts({ size: 4 });
  return { settings: settings?.value ?? {}, featuredProducts };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [form] = Form.useForm();

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
      <Form form={form}>
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

        <Button type="primary" htmlType="submit">
          Send Comment <SendOutlined />
        </Button>
      </Form>
    </div>
  );
}
