import { useAuth } from "~/hooks/use-auth";
import { UserType } from "~/lib/enums";
import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Avatar, Dropdown } from "antd";

const UserMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      // onClick: async () => await handleLogout(),
    },
  ];

  return (
    <Dropdown
      trigger="click"
      menu={{ items: items.filter((item) => !item.hide) }}
    >
      <button className="cursor-pointer">
        <Avatar icon={<UserOutlined />} />
      </button>
    </Dropdown>
  );
};

export default UserMenu;
