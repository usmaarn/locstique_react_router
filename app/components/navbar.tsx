import { useAuth } from "~/hooks/use-auth";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import AppLogo from "./app-logo";
import CartMenu from "./cart-menu";
import { Link, useNavigate, useNavigation } from "react-router";
import UserMenu from "./user-menu";

const menuItems = [
  {
    key: "/",
    label: "Home",
  },
  {
    key: "/shop",
    label: "Shop",
  },
  {
    key: "/contact",
    label: "Contact Us",
  },
];

const Navbar = () => {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();

  useEffect(() => {
    setOpen(false);
  }, [navigation.location]);

  return (
    <Layout.Header className="bg-white! px-0! md:h-24!">
      <Flex
        align="center"
        justify="space-between"
        className="max-w-7xl! mx-auto! px-5! h-full"
      >
        <div className="hidden md:flex items-center gap-5">
          {menuItems.map((item) => (
            <Link
              to={item.key}
              className="text-sm font-medium text-primary!"
              key={item.key}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Button
          icon={<MenuOutlined className="text-xl!" />}
          type="text"
          size="small"
          className="md:hidden!"
          onClick={() => setOpen(true)}
        />
        <Drawer title="Menu" open={open} onClose={() => setOpen(false)}>
          <Menu
            items={menuItems}
            mode="inline"
            style={{ border: 0 }}
            onClick={(info) => navigate(info.key)}
          />
        </Drawer>
        <AppLogo className="md:text-5xl" />
        <div className="place-self-end flex h-full items-center gap-3">
          {auth.user && <UserMenu />}
          <CartMenu />
        </div>
      </Flex>
    </Layout.Header>
  );
};

export default Navbar;
