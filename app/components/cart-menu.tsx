import { type CartItem } from "~/lib/types";
import { calculateDiscount, getImageSrc } from "~/lib/utils";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link, useNavigation } from "react-router";
import {
  Badge,
  Button,
  Drawer,
  Flex,
  InputNumber,
  List,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { ProductProvider, ProductTitle, RemoveFromCartButton } from "./product";
import { PriceFormat } from "./price-format";
import { useCart } from "~/providers/cart-provider";

const CartMenu = () => {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  const totalAmount = cart.items.reduce(
    (acc, item) =>
      acc + item.quantity * calculateDiscount(item.price, item.discount),
    0
  );

  useEffect(() => {
    setOpen(false);
  }, [navigation.location]);

  return (
    <>
      <Badge count={cart.items.length} size="small">
        <Button
          onClick={() => setOpen(true)}
          icon={<ShoppingCartOutlined className="text-3xl!" />}
          type="text"
          size="small"
          className="relative"
        />
      </Badge>
      <Drawer open={open} onClose={() => setOpen(false)} title="Your Cart">
        <Flex vertical className="h-full">
          <List
            className="grow!"
            size="small"
            itemLayout="vertical"
            dataSource={cart.items}
            renderItem={(item) => <Item key={item.id} item={item} />}
          />
          <Space
            hidden={!cart.items.length}
            direction="vertical"
            className="w-full"
          >
            <Flex justify="space-between">
              <Typography.Title level={4}>Subtotal</Typography.Title>
              <Typography.Title level={4}>
                <PriceFormat value={totalAmount} />
              </Typography.Title>
            </Flex>
            <Link to="/checkout">
              <Button className="w-full" type="primary" size="large">
                Buy It Now
              </Button>
            </Link>
          </Space>
        </Flex>
      </Drawer>
    </>
  );
};

function Item({ item }: { item: CartItem }) {
  const cart = useCart();

  return (
    <ProductProvider product={item}>
      <List.Item
        extra={
          <RemoveFromCartButton
            icon={<DeleteOutlined />}
            size="small"
            type="text"
          />
        }
      >
        <List.Item.Meta
          avatar={<img src={getImageSrc(item.image)} width={40} />}
          title={<ProductTitle className="text-sm! font-medium" />}
          description={
            <Flex justify="space-between" align="end">
              <Space.Compact>
                <Button
                  onClick={() => cart.updateItem(item.id, item.quantity - 1)}
                  icon={<MinusOutlined />}
                />
                <InputNumber
                  value={item.quantity}
                  style={{ width: 70 }}
                  min={1}
                  onChange={(v) => cart.updateItem(item.id, v as number)}
                />
                <Button
                  onClick={() => cart.updateItem(item.id, item.quantity + 1)}
                  icon={<PlusOutlined />}
                />
              </Space.Compact>
              <Typography.Title level={5} className="text-sm!">
                <PriceFormat
                  value={
                    calculateDiscount(item.price, item.discount) * item.quantity
                  }
                />
              </Typography.Title>
            </Flex>
          }
        />
      </List.Item>
    </ProductProvider>
  );
}

export default CartMenu;
