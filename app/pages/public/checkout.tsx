import { config } from "~/lib/config";
import type { Route } from "./+types";
import { redirect, useFetcher } from "react-router";
import type { CartItem } from "~/lib/types";
import { Col, Form, Row } from "antd";
import { CheckoutFallback } from "~/components/fallbacks/checkout-fallback";
import CheckoutSummary from "~/components/checkout-summary";
import CheckoutItems from "~/components/checkout-items";
import { paymentService } from "~/services/payment-service";
import { userService } from "~/services/user-service";

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
  const user = await userService.findByEmail("admin@test.com");
  if (user) {
    const response = await paymentService.makePayment(user, { items, address });
    if (response.redirectUrl) {
      return redirect(response.redirectUrl);
    }
    return { message: "Unable to perform action" };
  }
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
