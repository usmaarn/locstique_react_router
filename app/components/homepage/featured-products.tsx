import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { Button, Typography } from "antd";
import ProductCard from "../product-card";
import type { Product } from "~/database/schema";

const FeaturedProducts = ({ products }: { products?: Product[] }) => {
  return (
    <div className="flex flex-col items-center gap-10 container px-5 py-10">
      <Typography.Title className="text-3xl! text-center font-bold!">
        Fall/Winter Essentials
      </Typography.Title>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link to="/shop">
        <Button icon={<ArrowRightOutlined />} iconPosition="end" type="primary">
          View All
        </Button>
      </Link>
    </div>
  );
};

export default FeaturedProducts;
