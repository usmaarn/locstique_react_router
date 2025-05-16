import { config } from "~/lib/config";
import { useEffect, useState, useTransition } from "react";
import {
  Button,
  Col,
  Divider,
  Flex,
  Input,
  Layout,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import { Link } from "react-router";

const Footer = () => {
  const [loading, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const defaultSubscribed = localStorage.getItem(
      config.storage.subscribedName
    );
    if (defaultSubscribed && defaultSubscribed === "true") {
      setSubscribed(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      config.storage.subscribedName,
      subscribed ? "true" : "false"
    );
  }, [subscribed]);

  function handleSubscribe() {
    startTransition(async () => {
      try {
        // await api.post("/subscribe", { email });
        message.success("Subscription successful!");
        setSubscribed(true);
      } catch (error: any) {
        message.error(error?.response?.data?.message ?? "An error occurred!");
      }
    });
  }

  return (
    <Layout.Footer className="bg-primary! px-0!">
      <Flex vertical gap={12} hidden={subscribed} className="px-4!">
        <Typography.Title level={2} className="text-center text-gray-200!">
          Subscribe to our Email
        </Typography.Title>
        <Typography.Paragraph className="text-gray-300! text-center">
          Join our email list for exclusive offers and the latest news.
        </Typography.Paragraph>

        <Space direction="vertical" className="w-full max-w-[400px] mx-auto">
          <Input
            placeholder="Email Address"
            value={email}
            size="large"
            className="bg-transparent! text-gray-300! border-gray-700! placeholder:text-gray-400!"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <Button
            size="large"
            className="w-full bg-gray-700! border-none! text-white!"
            onClick={handleSubscribe}
            loading={loading}
          >
            Subscribe
          </Button>
        </Space>
      </Flex>

      {!subscribed && <Divider className="bg-gray-800!" />}

      <Row gutter={[30, 12]} className="px-4 max-w-7xl mx-auto!">
        <Col span={12} md={6}>
          <Typography.Title level={4} className="text-gray-200!">
            Who We are?
          </Typography.Title>
          <Typography.Paragraph className="mt-2 text-gray-300!">
            Welcome to LocsTique, where timeless elegance meets modern
            empowerment. We curate a collection of women's products that inspire
            confidence and celebrate individuality.
          </Typography.Paragraph>
        </Col>

        <Col span={12} md={6}>
          <Typography.Title level={4} className="text-gray-200!">
            Our Mission
          </Typography.Title>
          <Typography.Paragraph className="mt-2 text-gray-300!">
            Empowering women through curated beauty. Our mission is simple -
            celebrate confidence, individuality, and style. Join us on a journey
            where beauty meets empowerment.
          </Typography.Paragraph>
        </Col>

        <Col span={12} md={6}>
          <Typography.Title level={4} className="text-gray-200!">
            Policies
          </Typography.Title>
          <Space direction="vertical" className="mt-2">
            <Link className="text-gray-300! hover:underline!" to="/contact">
              Contact Us
            </Link>
            <Link
              className="text-gray-300! hover:underline!"
              to="/pages/shipping_policy"
            >
              Shipping Policy
            </Link>
            <Link
              className="text-gray-300! hover:underline!"
              to="/pages/terms_of_service"
            >
              Terms of Service
            </Link>
            <Link
              className="text-gray-300! hover:underline!"
              to="/pages/refund_policy"
            >
              Refund Policy
            </Link>
          </Space>
        </Col>

        <Col span={12} md={6}>
          <Typography.Title level={4} className="text-gray-200!">
            Need Help?
          </Typography.Title>
          <Space direction="vertical" className="mt-2">
            <Link className="text-gray-300! hover:underline!" to="/">
              Home
            </Link>
            <Link className="text-gray-300! hover:underline!" to="/shop">
              Shop
            </Link>
            <Link className="text-gray-300! hover:underline!" to="/contact">
              Contact Us
            </Link>
          </Space>
        </Col>
      </Row>

      <Divider className="bg-gray-800!" />

      <section>
        <Typography.Paragraph className="text-center text-gray-300! m-0!">
          &copy; {new Date().getFullYear()}, Locstique
        </Typography.Paragraph>
      </section>
    </Layout.Footer>
  );
};

export default Footer;
