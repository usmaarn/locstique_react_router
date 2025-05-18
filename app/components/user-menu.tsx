import { useAuth } from "~/hooks/use-auth";
import { UserType } from "~/lib/enums";
import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useFetcher, useNavigate } from "react-router";
import { Avatar, Dropdown, Spin } from "antd";

const UserMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  if (!user) return null;

  const items = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      hide: user?.type !== UserType.ADMIN,
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: () =>
        fetcher.submit(null, { method: "POST", action: "/logout" }),
    },
  ];

  return (
    <>
      <Spin spinning={fetcher.state != "idle"} fullscreen />
      <Dropdown
        trigger="click"
        menu={{ items: items.filter((item) => !item.hide) }}
      >
        <button className="cursor-pointer">
          <Avatar icon={<UserOutlined />} />
        </button>
      </Dropdown>
    </>
  );
};

export default UserMenu;
