import { config } from "~/lib/config";
import type { Route } from "./+types/checkout";
import { redirect, useFetcher } from "react-router";
import type { CartItem } from "~/lib/types";
import { Col, Form, message, Row } from "antd";
import { CheckoutFallback } from "~/components/fallbacks/checkout-fallback";
import CheckoutSummary from "~/components/checkout-summary";
import CheckoutItems from "~/components/checkout-items";
import { paymentService } from "~/services/payment-service.server";
import { getSession } from "~/session.server";
import { sessionService } from "~/services/session-service.server";
import { useEffect } from "react";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const itemsJson = localStorage.getItem(config.storage.cartName);
  if (itemsJson) {
    const items = JSON.parse(itemsJson) as CartItem[];
    if (items.length > 0) return { items };
  }
  return redirect("/shop");
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const items = JSON.parse((formData.get("items") as string) ?? "[]");
  const address = formData.get("address") as string;

  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("userId");
  if (sessionId) {
    const result = await sessionService.validateSessionToken(sessionId);
    if (result.user) {
      const response = await paymentService.makePayment(result.user, {
        items,
        address,
      });
      if (response.redirectUrl) {
        return redirect(response.redirectUrl);
      }
      return { message: response?.error ?? "Unable to perform action" };
    }
  }
  return redirect(`/login?redirect_url=${request.url}`);
}

export default function Page({ loaderData: { items } }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const loading = fetcher.state !== "idle";

  function handleCheckout(values: any) {
    fetcher.submit(
      {
        ...values,
        items: JSON.stringify(
          items.map((item: any) => ({ id: item.id, quantity: item.quantity }))
        ),
      },
      { method: "POST" }
    );
  }

  useEffect(() => {
    if (fetcher.data?.message) {
      message.error(fetcher.data.message);
    }
  }, [fetcher.data]);

  return (
    <Form onFinish={handleCheckout}>
      <Row gutter={[24, 24]} className="p-3 max-w-6xl mx-auto!">
        <Col span={24} md={16}>
          <CheckoutItems />
        </Col>
        <Col span={24} md={8}>
          <CheckoutSummary loading={loading} />
        </Col>
      </Row>
    </Form>
  );
}

export function HydrateFallback() {
  return <CheckoutFallback />;
}
