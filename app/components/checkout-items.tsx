import { Avatar, Card, Form, Input, List, Space } from "antd";
import { useLoaderData } from "react-router";
import type { CartItem } from "~/lib/types";
import { getImageSrc } from "~/lib/utils";

const CheckoutItems = () => {
  const { items }: { items: CartItem[] } = useLoaderData();

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card
        title="Cart Items"
        className="bg-gray-50!"
        classNames={{ body: "p-0!" }}
      >
        <List
          size="small"
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={getImageSrc(item.image)}
                    shape="square"
                    size="large"
                  />
                }
                title={item.name}
                description={<p>QTY: {item.quantity}</p>}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card className="bg-gray-50!" title="Delivery Address">
        <Form.Item name="address" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Enter delivery address" />
        </Form.Item>
      </Card>
    </Space>
  );
};

export default CheckoutItems;
