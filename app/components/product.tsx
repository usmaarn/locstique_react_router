import { useCart } from "~/providers/cart-provider";
import { calculateDiscount, cn, getImageSrc } from "~/lib/utils";
import { type Product } from "~/database/schema";
import { NumericFormat, type NumericFormatProps } from "react-number-format";

import {
  type ComponentProps,
  createContext,
  type MouseEventHandler,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Button, type ButtonProps, Skeleton, Tag, type TagProps } from "antd";
import { TagFilled } from "@ant-design/icons";

const ProductContext = createContext<Product | null>(null);

const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return ctx as Product;
};

export const ProductProvider = ({
  product,
  children,
}: PropsWithChildren & {
  product: Product;
}) => {
  if (!product) {
    return <p>No Product passed</p>;
  }
  return (
    <ProductContext.Provider value={product}>
      {children}
    </ProductContext.Provider>
  );
};

export function ProductImage({
  size,
  className,
  ...props
}: Readonly<{
  size?: number;
  className?: string;
}> &
  ComponentProps<"img">) {
  const product = useProductContext();
  return (
    <img
      width={size}
      height={size}
      src={getImageSrc(product.images?.[0])}
      alt="Product"
      className={className}
      {...props}
    />
  );
}

export function ProductPrice(props: NumericFormatProps) {
  const product = useProductContext();
  return (
    <NumericFormat
      allowNegative={false}
      decimalScale={2}
      displayType="text"
      value={product.price}
      prefix="$"
      {...props}
    />
  );
}

export function ProductDiscount(props: NumericFormatProps) {
  const product = useProductContext();
  return (
    <NumericFormat
      allowNegative={false}
      decimalScale={2}
      displayType="text"
      value={calculateDiscount(product.price, product.discount)}
      prefix="$"
      {...props}
    />
  );
}

export function ProductTitle(props: ComponentProps<"span">) {
  const product = useProductContext();
  return <span {...props}>{product.name}</span>;
}

export function ProductTag(props: ComponentProps<"span">) {
  const product = useProductContext();
  return <span {...props}>{product.tag}</span>;
}

export function ProductDescription({
  className,
  ...props
}: ComponentProps<"div">) {
  const product = useProductContext();

  return (
    <div
      className={cn(className)}
      {...props}
      dangerouslySetInnerHTML={{ __html: product.description }}
    />
  );
}

export function ProductDetails({ className, ...props }: ComponentProps<"div">) {
  const product = useProductContext();

  return (
    <div
      className={cn(className)}
      {...props}
      dangerouslySetInnerHTML={{ __html: product.details }}
    />
  );
}

export function ProductLoader() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-32 md:h-64" />
      <div className="space-y-1">
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
      </div>
      <div className="space-x-2">
        <Skeleton className="inline-block h-3 w-10" />
        <Skeleton className="inline-block h-3 w-10" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export const AddToCartButton = ({ children, ...props }: ButtonProps) => {
  const product = useProductContext();
  const [loading, startTransition] = useTransition();
  const cart = useCart();

  const [inCart, setInCart] = useState(
    cart.items.some((i) => i.id === product.id)
  );

  const handleClick: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => cart.addItem(product));
  };

  useEffect(() => {
    setInCart(cart.items.some((i) => i.id === product.id));
  }, [product, cart.items]);

  return (
    <Button
      htmlType="button"
      disabled={loading || inCart}
      onClick={handleClick}
      {...props}
      loading={loading}
    >
      {children}
    </Button>
  );
};

export const RemoveFromCartButton = ({ children, ...props }: ButtonProps) => {
  const product = useProductContext();
  const [loading, startTransition] = useTransition();
  const cart = useCart();

  const [inCart, setInCart] = useState(
    cart.items.some((i) => i.id === product.id)
  );

  const handleClick: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => cart.removeItem(product.id));
  };

  useEffect(() => {
    setInCart(cart.items.some((i) => i.id === product.id));
  }, [product, cart.items]);

  return (
    <Button
      disabled={loading || !inCart}
      onClick={handleClick}
      {...props}
      loading={loading}
    >
      {children}
    </Button>
  );
};

export function ProductDiscountTag({ className, ...props }: TagProps) {
  const product = useProductContext();
  return product.discount ? (
    <Tag
      className={cn(
        "bg-foreground! text-background! inline-flex! items-center! rounded-sm! font-bold! border-primary!",
        className
      )}
      icon={<TagFilled />}
      {...props}
    >
      SAVE {product.discount}%
    </Tag>
  ) : null;
}
