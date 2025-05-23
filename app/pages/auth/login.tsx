import { Button, Divider, Form, Input, message, Typography } from "antd";
import { Link, redirect, useFetcher, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import { commitSession, getSession } from "~/session.server";
import { config } from "~/lib/config";
import { sessionService } from "~/services/session-service.server";
import { validateSchema } from "~/lib/helper.server";
import { loginSchema } from "~/schemas/user-schema";
import { userService } from "~/services/user-service.server";
import { verify } from "argon2";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: `${config.appName} | Login` }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/");
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const validated = await validateSchema(
    loginSchema,
    Object.fromEntries(formData)
  );

  if (validated.data) {
    const user = await userService.findByEmail(validated.data.email);

    if (user) {
      const isMatchedPassword = await verify(
        user.password,
        validated.data.password
      );
      if (isMatchedPassword) {
        const session = await getSession(request.headers.get("Cookie"));

        const sessionId = sessionService.generateSessionToken();
        const userSession = await sessionService.create(sessionId, user.id);

        session.set("userId", userSession.id);

        const searchParams = new URLSearchParams(request.url.split("?")[1]);
        const redirectUrl = searchParams.get("redirect_url") ?? "/";

        return redirect(redirectUrl, {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }
    }
  }
  return { error: "Incorrect email or password" };
}

export default function Page(props: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher();
  const pending = fetcher.state !== "idle";

  const [form] = Form.useForm();

  function handleSubmit(values: any) {
    fetcher.submit(values, { method: "POST" });
  }

  useEffect(() => {
    if (fetcher.data?.error) {
      form.setFields([{ name: "email", errors: [fetcher.data.error] }]);
    }
  }, [fetcher.data]);

  return (
    <div className="max-w-[400px] mx-auto py-8 px-5">
      <Form form={form} size="large" onFinish={handleSubmit} className="w-full">
        <Typography.Title level={4}>Login</Typography.Title>
        <Typography.Paragraph>Resume your activities.</Typography.Paragraph>

        <Form.Item name="email" rules={[{ required: true }]}>
          <Input type="email" placeholder="Email address" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          className="w-full"
          loading={pending}
        >
          Login
        </Button>

        <Divider />

        <div className="">
          <p>
            {"Don't have an account? "}
            <Link
              to={`/register?redirect_url=${searchParams.get("redirect_url")}`}
              className="text-blue-600!"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
