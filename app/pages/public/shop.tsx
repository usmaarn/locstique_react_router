import { Skeleton, Space, Typography } from "antd";
import ProductsFilter from "~/components/products-filter";
import type { Route } from "./+types";
import { productService } from "~/services/product-service.server";
import ProductCard from "~/components/product-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Locstique | Shop" },
    { name: "description", content: "Welcome to Locstique!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const products = await productService.queryProducts({ size: 20 });
  return { products };
}

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
  return await serverLoader();
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <div className="py-8 px-3 max-w-7xl mx-auto space-y-5">
      <Typography.Title level={1} className="text-center mb-5!">
        Best Sellers
      </Typography.Title>
      <ProductsFilter />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 lg:gap-8 items-start">
        {loaderData.products.map((product) => (
          <ProductCard product={product} key={product.id} showAddToCart />
        ))}
      </div>
    </div>
  );
}

export function HydrateFallback() {
  return (
    <div className="py-8 px-3 max-w-7xl mx-auto space-y-5">
      <Typography.Title level={1} className="text-center mb-5!">
        Best Sellers
      </Typography.Title>
      <ProductsFilter />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 lg:gap-8 items-start">
        {Array(20).map((id) => (
          <div key={id} className="">
            <Skeleton.Image active />
            <Skeleton active paragraph={{ rows: 2, style: { height: 20 } }} />
            <Space>
              <Skeleton.Button active />
              <Skeleton.Button active />
            </Space>
            <Skeleton.Button active block />
          </div>
        ))}
      </div>
    </div>
  );
}
