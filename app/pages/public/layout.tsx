import { Card, FloatButton, Layout, Typography } from "antd";
import { UpOutlined } from "@ant-design/icons";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
import { cn } from "~/lib/utils";
import { Outlet } from "react-router";

const PublicLayout = () => {
  return (
    <Layout id="page" className="min-h-screen bg-white flex flex-col">
      <Banner />
      <Navbar />
      <Layout.Content className={cn("grow! bg-white")}>
        <FloatButton href="#page" icon={<UpOutlined />} />
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
};

function Banner() {
  return (
    <Card
      className="text-center bg-purple-900! rounded-none! border-0!"
      classNames={{ body: "py-2.5!" }}
    >
      <Typography.Paragraph className="text-base! font-bold text-center text-white! m-0!">
        50% Off + FREE Shipping Today
      </Typography.Paragraph>
    </Card>
  );
}

export default PublicLayout;
