import {
  AddToCartButton,
  ProductDiscount,
  ProductDiscountTag,
  ProductImage,
  ProductPrice,
  ProductProvider,
} from "./product";
import { Link, type LinkProps } from "react-router";
import { Typography } from "antd";
import { cn } from "~/lib/utils";
import type { Product } from "~/database/schema";

const ProductCard = ({
  product,
  showAddToCart,
  className,
  ...props
}: Omit<LinkProps, "to"> & {
  product: Product;
  showAddToCart?: boolean;
  className?: string;
}) => {
  return (
    <ProductProvider key={product.id} product={product}>
      <Link
        to={`/shop/${product.id}`}
        // reloadDocument
        className={cn(
          "shrink-0! w-full max-w-40 md:max-w-96 bg-gray-50! rounded-md shadow border",
          className
        )}
        {...props}
      >
        <div className="relative h-32 md:h-64">
          <ProductImage height={100} className="h-full w-full object-contain" />
          <ProductDiscountTag className="text-[10px]! md:text-xs! h-5! md:h-6! px-1! absolute! bottom-2 left-2!" />
        </div>
        <div className="px-3 py-2">
          <Typography.Title
            level={5}
            className="leading-tight text-sm! md:text-lg! lg:text-xl! mb-2"
            ellipsis={{ rows: 2 }}
          >
            {product.name}
          </Typography.Title>
          <h3 className="text-sm md:text-base lg:text-lg md:mt-2 text-purple-400 space-x-1">
            <ProductDiscount className="font-bold" />
            <ProductPrice
              hidden={!product.discount}
              className="text-xs md:text-sm font-medium text-foreground line-through"
            />
          </h3>
          <AddToCartButton
            hidden={!showAddToCart}
            type="primary"
            className="w-full text-xs! h-7! md:h-9! md:text-sm! mt-3"
            children="Add to Cart"
          />
        </div>
      </Link>
    </ProductProvider>
  );
};

export default ProductCard;
