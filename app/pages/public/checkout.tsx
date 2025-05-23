import { config } from "~/lib/config";
import type { Route } from "./+types/checkout";
import { redirect, useFetcher } from "react-router";
import type { CartItem } from "~/lib/types";
import { Col, Form, message, Row } from "antd";
import { CheckoutFallback } from "~/components/fallbacks/checkout-fallback";
import CheckoutSummary from "~/components/checkout-summary";
import CheckoutItems from "~/components/checkout-items";
import { getSession } from "~/session.server";
import { sessionService } from "~/services/session-service.server";
import { useEffect } from "react";
// import PayStackPop from "@paystack/inline-js";
import { type OrderItemDto } from "~/lib/types";
import { checkoutService } from "~/services/checkoutService.server";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const itemsJson = localStorage.getItem(config.storage.cartName);
  if (itemsJson) {
    const items = JSON.parse(itemsJson) as CartItem[];
    if (items.length > 0) return { items };
  }
  return redirect("/shop");
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.json();
  const items = JSON.parse(formData.items) as OrderItemDto[];

  const deliveryAddress = formData.address as string;

  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("userId");

  if (sessionId) {
    const { user } = await sessionService.validateSessionToken(sessionId);
    if (user) {
      const response = await checkoutService
        .processCheckout({ user, deliveryAddress, items })
        .catch(console.log);
      if (response?.redirect_url) {
        console.log(response);
        return redirect(response.redirectUrl);
      }
      return { message: "Unable to perform action" };
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
          items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
          }))
        ),
      },
      { method: "POST", encType: "application/json" }
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
