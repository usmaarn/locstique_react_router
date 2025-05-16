import {
  Button,
  Checkbox,
  Flex,
  Form,
  InputNumber,
  Popover,
  Select,
  Space,
  Typography,
} from "antd";

const ProductsFilter = () => {
  const [form] = Form.useForm();

  return (
    <Flex style={{ marginBottom: 10 }} align="start" justify="space-between">
      <Popover
        placement="bottomLeft"
        trigger="click"
        title={
          <Flex gap={5}>
            <Typography.Title style={{ flexGrow: 1 }} level={5}>
              Filter & Sorting
            </Typography.Title>
            <Button size="small" type="primary">
              Apply
            </Button>
            <Button size="small">Reset</Button>
          </Flex>
        }
        content={() => (
          <Form>
            <Form.Item label="Availability">
              <Checkbox>In Stock</Checkbox>
              <Checkbox>Out of Stock</Checkbox>
            </Form.Item>

            <Form.Item label="Price range">
              <Space.Compact>
                <InputNumber />
                <InputNumber />
              </Space.Compact>
            </Form.Item>
          </Form>
        )}
      >
        <Button>Filter</Button>
      </Popover>

      <Space>
        <Typography.Paragraph className="hidden md:block m-0!">
          Sort By:
        </Typography.Paragraph>
        <Select
          style={{ width: 180 }}
          placeholder="Sort By"
          options={[
            { label: "Best Selling", value: "best_selling" },
            { label: "Alphabetical A-Z", value: "name_asc" },
            { label: "Alphabetical Z-A", value: "name_desc" },
            { label: "Price: Low to High", value: "price_asc" },
            { label: "Price: High to Low", value: "price_desc" },
            { label: "Oldest Product", value: "oldest" },
            { label: "Laest Products", value: "latest" },
          ]}
        />
      </Space>
    </Flex>
  );
};

export default ProductsFilter;
