import type { Route } from "./+types/checkout.payment_status";
import { paymentService } from "~/services/payment-service.server";
import { userService } from "~/services/user-service.server";
import { OrderStatus } from "~/lib/enums";
import { config } from "~/lib/config";
import { Link, redirect } from "react-router";
import { Button, Result } from "antd";
import { ArrowRightOutlined, ReloadOutlined } from "@ant-design/icons";

export async function loader({ request }: Route.LoaderArgs) {
  const search = new URLSearchParams(request.url.split("?")[1]);
  const user = await userService.findByEmail("admin@test.com");
  const txRef = search.get("tx_ref");
  const transactionId = search.get("transaction_id");
  if (user) {
    if (txRef && transactionId) {
      const response = await paymentService.verifyPayment(user, {
        txRef,
        transactionId,
      });
      if (response.success) {
        return {
          paymentStatus: OrderStatus.PENDING_DELIVERY,
          txRef: search.get("tx_ref"),
        };
      }
    }
  }
  return { paymentStatus: OrderStatus.PENDING_PAYMENT };
}

export async function clientLoader({
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const cartItem = localStorage.getItem(config.storage.cartName);
  if (!cartItem) return redirect("/shop");

  const response = await serverLoader();
  if (response.paymentStatus === OrderStatus.PENDING_DELIVERY) {
    localStorage.removeItem(config.storage.cartName);
  }
  return response;
}

export default function Page({ loaderData }: Route.ComponentProps) {
  if (loaderData.paymentStatus === OrderStatus.PENDING_PAYMENT) {
    return (
      <div className="p-5">
        <Result
          status="error"
          title="Payment Failed"
          subTitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, dolores vitae nam eveniet odio asperiores"
          extra={
            <Link to="/checkout">
              <Button danger icon={<ReloadOutlined />} type="primary">
                Retry
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-5">
      <Result
        status="success"
        title="Payment Sucessful"
        subTitle={
          <div>
            <p className="text-xs text-center mt-5 text-gray-500">
              Your payment has been recieved and your order with ID:{" "}
              <Link
                to={`/orders/${loaderData.txRef}`}
                className="font-medium hover:underline"
              >
                {loaderData.txRef}
              </Link>{" "}
              is being processed.
            </p>
            <p className="text-xs text-center mt-5 text-gray-500">
              {" "}
              Thank you for shopping with us.
            </p>
          </div>
        }
        extra={
          <Link to="/shop">
            <Button
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              type="primary"
            >
              Shop More
            </Button>
          </Link>
        }
      />
    </div>
  );
}
