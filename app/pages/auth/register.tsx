import { Button, Divider, Form, Input, Typography } from "antd";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/register";
import { config } from "~/lib/config";

export function meta({}: Route.MetaArgs) {
  return [{ title: `${config.appName} | Register` }];
}

export default function Page(props: Route.ComponentProps) {
  const [searchParams] = useSearchParams();

  function handleSubmit() {}
  return (
    <div className="max-w-[400px] mx-auto py-8">
      <Form size="large" onFinish={handleSubmit} className="w-full">
        <Typography.Title level={4}>Register</Typography.Title>
        <Typography.Paragraph>Lets get you started.</Typography.Paragraph>

        <Form.Item name="name">
          <Input placeholder="Full name: e.g: john doe" />
        </Form.Item>

        <Form.Item name="email" rules={[{ required: true }]}>
          <Input type="email" placeholder="Email address" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item name="confirmPassword" rules={[{ required: true }]}>
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          className="w-full"
          // loading={mutation.isPending}
        >
          Register
        </Button>

        <Divider />

        <div className="">
          <p>
            {"Already have an account? "}
            <Link
              to={`/login?redirect_url=${searchParams.get("redirect_url")}`}
              className="text-blue-600!"
            >
              Sign In
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
