import { useEffect, useMemo } from "react";
import type { Route } from "./+types/products";
import {
  Button,
  Card,
  Image,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { getImageSrc } from "~/lib/utils";
import type { Product } from "~/database/schema.server";
import { Link, useFetcher } from "react-router";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { productService } from "~/services/product-service.server";
import { ButtonLink } from "~/components/link";

export async function loader({}: Route.LoaderArgs) {
  const products = await productService.queryProducts({});
  return { products };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  if (request.method === "DELETE") {
    try {
      const productId = formData.get("productId") as string;
      if (productId) {
        const product = await productService.findById(productId);
        if (product) {
          await productService.delete(product);
          return { message: "Product deleted successfully!" };
        }
      }
      throw new Error("unable to delete product");
    } catch (error) {
      return { error: "unable to delete product!" };
    }
  }
  console.log(request.method);
}

export default function Page({
  loaderData: { products },
}: Route.ComponentProps) {
  const [messageApi, messageContext] = message.useMessage();
  const fetcher = useFetcher();

  const columns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "images",
        width: 60,
        render: (src: string[]) => {
          return <Image src={getImageSrc(src[0])} alt="" width={20} />;
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        width: 300,
      },
      {
        title: "Price",
        dataIndex: "price",
        width: 100,
        render: (text: number) => `$${text}`,
      },
      {
        title: "Stock",
        dataIndex: "stock",
        width: 100,
        render: (stock: number) => {
          return stock > 0 ? stock : <Tag color="red">out of stock</Tag>;
        },
      },
      {
        title: "Discount",
        dataIndex: "discount",
        width: 100,
        render: (text: number) => <span>{text}%</span>,
      },
      {
        title: "Action",
        width: 150,
        // fixed: "right",
        render: (_: any, row: Product) => (
          <Space>
            <ButtonLink
              to={`/dashboard/products/${row.id}/edit`}
              size="small"
              type="primary"
            >
              Edit
            </ButtonLink>

            <Popconfirm
              title="Delete Product"
              description="Are you sure you want to permanently delete this product?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={async () =>
                fetcher.submit({ productId: row.id }, { method: "DELETE" })
              }
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (fetcher.data?.message) messageApi.success(fetcher.data.message);
    if (fetcher.data?.error) messageApi.error(fetcher.data.error);
  }, [fetcher.data]);

  return (
    <>
      {messageContext}
      <Card
        title={
          <div className="flex items-center justify-between">
            <Typography.Title level={4} className="m-0!">
              Products
            </Typography.Title>

            <ButtonLink
              to="/dashboard/products/create"
              icon={<PlusOutlined />}
              type="primary"
            >
              Add Product
            </ButtonLink>
          </div>
        }
      >
        <Table
          loading={fetcher.state != "idle"}
          size="small"
          scroll={{ x: 1000 }}
          id="id"
          dataSource={products ?? []}
          columns={columns}
        />
      </Card>
    </>
  );
}
