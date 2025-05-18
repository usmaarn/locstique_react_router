import AppLogo from "./app-logo";
import { cn } from "~/lib/utils";
import {
  CommentOutlined,
  DashboardOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import { Layout, Menu } from "antd";

const Sidebar = ({ open }: { open: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    {
      icon: <DashboardOutlined />,
      label: "Dashboard",
      key: "/dashboard",
    },
    {
      icon: <UnorderedListOutlined />,
      label: "Products",
      key: "/dashboard/products",
    },
    {
      icon: <TagsOutlined />,
      label: "Feedbacks",
      key: "/dashboard/feedbacks",
    },
    {
      icon: <ShoppingCartOutlined />,
      label: "Orders",
      key: "/dashboard/orders",
    },
    {
      icon: <UserOutlined />,
      label: "Customers",
      key: "/dashboard/customers",
    },
    {
      icon: <CommentOutlined />,
      label: "Reviews",
      key: "/dashboard/reviews",
    },
    {
      key: "/dashboard/settings/home_page",
      icon: <SettingOutlined />,
      label: "Settings",
      style: { marginTop: 100 },
    },
  ];

  return (
    <Layout.Sider
      width={256}
      className={cn(
        "fixed! top-0 z-50! bg-white! p-4 shadow h-screen md:static!",
        open ? "left-0" : "-left-[256px]"
      )}
    >
      <aside className="h-full flex flex-col">
        <div className="p-3">
          <AppLogo />
        </div>

        <div className="grow">
          <Menu
            onSelect={({ key }) => navigate(key)}
            defaultSelectedKeys={[location.pathname]}
            theme="light"
            mode="inline"
            items={items}
          />
        </div>
      </aside>
    </Layout.Sider>
  );
};

export default Sidebar;
