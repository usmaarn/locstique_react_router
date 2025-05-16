import { productService } from "~/services/product-service";
import type { Route } from "./+types";
import { data } from "react-router";
import {
  AddToCartButton,
  ProductDescription,
  ProductDetails,
  ProductDiscount,
  ProductDiscountTag,
  ProductPrice,
  ProductProvider,
  ProductTag,
  ProductTitle,
} from "~/components/product";
import {
  Avatar,
  Button,
  Col,
  Collapse,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { getImageSrc } from "~/lib/utils";
import { RollbackOutlined } from "@ant-design/icons";
import ProductCard from "~/components/product-card";
import { reviewService } from "~/services/review-service";

export function meta({ params }: Route.MetaArgs) {
  // const product = await productService.findById(params.id!);
  return [
    { title: `Locstique | ${params.id}` },
    { name: "description", content: "Welcome to Locstique!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const productId = params.id as string;
  const product = await productService.findById(productId);
  if (!product) throw data({ message: "Product Not Found" }, 404);
  return {
    product,
    relatedProducts: await productService.queryProducts({ size: 8 }),
    reviews: await reviewService.queryReviews({}),
  };
}

export default function Page({
  loaderData: { product, relatedProducts, reviews },
}: Route.ComponentProps) {
  const productImages = product.images.map((image) => getImageSrc(image));
  const [activeImage, setActiveImage] = useState(productImages[0]);

  useEffect(() => {
    setActiveImage(productImages[0]);
  }, [productImages]);

  return (
    <ProductProvider product={product}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:space-y-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              width="100%"
              className="object-contain h-[250px]! md:h-[400px]!"
              src={activeImage}
            />
            <div className="flex justify-center overflow-x-auto gap-2">
              {productImages.map((image) => (
                <Button
                  htmlType="button"
                  className="size-12! border shrink-0! p-0.5!"
                  key={image}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} />
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-5!">
            <Tag color="red" className="font-semibold! py-1.5! text-sm!">
              <ProductTag />
            </Tag>
            <Typography.Title className="text-3xl! lg:text-4xl! font-bold! mb-6!">
              <ProductTitle />
            </Typography.Title>

            <div className="inline-flex items-center gap-4">
              <Typography.Title className="text-xl! font-bold text-purple-400! space-x-1">
                <ProductDiscount />
                <ProductPrice
                  hidden={!product.discount}
                  className="text-foreground line-through text-base!"
                />
              </Typography.Title>
              <ProductDiscountTag className="" />
            </div>

            <ProductDescription className="prose prose-sm leading-7" />

            <AddToCartButton
              className="w-full h-12! uppercase font-bold!"
              type="primary"
            >
              Add To Cart
            </AddToCartButton>

            <Collapse
              expandIconPosition="end"
              items={[
                {
                  key: "trial",
                  label: (
                    <Space align="center">
                      <RollbackOutlined className="text-lg!" />
                      <Typography.Text className="text-base! font-bold">
                        30 Days Risk Free Trial
                      </Typography.Text>
                    </Space>
                  ),
                  children: (
                    <div>
                      Try it out & if it doesn't fit or you don't like it you
                      can just ship it back for a replacement or refund within
                      30 days
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <ProductDetails className="text-center space-y-4 text-sm leading-7 mt-8 max-w-3xl mx-auto prose-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-bold mb-4 md:mb-8">More Products</h3>
        <div className="flex overflow-x-auto gap-3 pb-3">
          {relatedProducts?.map((product) => (
            <ProductCard
              className="md:max-w-60"
              product={product}
              key={product.id}
            />
          ))}
        </div>
      </div>

      <div className="my-4">
        <section className="bg-primary p-8 md:py-16">
          <h3 className="text-white text-2xl font-bold text-center md:mb-8">
            Why Buy From Us?
          </h3>

          <div className="divide-y divide-gray-800 md:divide-y-0 gap-8 flex overflow-auto md:grid grid-cols-3 max-w-6xl mx-auto">
            <div className="text-center gap-3 flex flex-col items-center py-6 min-w-64">
              <img src="/why_01.png" width={80} height={80} />
              <h3 className="text-white font-bold text-xl">
                Natural Ingredients
              </h3>
              <p className="text-sm text-gray-200">
                At Locstique we create all our products with carefully selected
                hypoallergenic and natural ingredients.
              </p>
            </div>
            <div className="text-center gap-3 flex flex-col items-center py-6 min-w-64">
              <img src="/why_02.png" width={80} height={80} />
              <h3 className="text-white font-bold text-xl">
                Crafted With Love
              </h3>
              <p className="text-sm text-gray-200">
                From premium ingredients to thoughtful formulas, our brand is
                dedicated to delivering an extraordinary experience.
              </p>
            </div>
            <div className="text-center gap-3 flex flex-col items-center py-6 min-w-64">
              <img src="/why_03.png" width={80} height={80} />
              <h3 className="text-white font-bold text-xl">
                We're Here For You
              </h3>
              <p className="text-sm text-gray-200">
                Our support staff is here to help 7 days a week with returns,
                refunds, or any questions.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed z-50 bottom-0 left-0 bg-white w-screen px-4 py-2 md:px-16 border-t flex items-center justify-between gap-4">
        <div className="">
          <Typography.Title
            ellipsis={{ rows: 2 }}
            className="leading-4 text-sm! md:text-lg! font-black!"
            children={<ProductTitle />}
          />
          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-xs md:text-lg font-bold text-purple-400 space-x-1">
              <ProductDiscount />
              <ProductPrice
                hidden={!product.discount}
                className="text-foreground line-through"
              />
            </h3>
            <ProductDiscountTag className="text-[9px]! h-4! px-1!" />
          </div>
        </div>
        <div className="">
          <AddToCartButton
            className="text-xs! px-2! h-7! md:px-4! md:h-9!"
            type="primary"
          >
            Add to Cart
          </AddToCartButton>
        </div>
      </div>

      <div className="flex justify-center flex-col gap-5 w-full max-w-6xl mx-auto px-4 py-8">
        <Typography.Title level={3} className="text-center font-black">
          Try It Out Risk-Free For 30 Days 💜
        </Typography.Title>

        <Row gutter={[24, 24]}>
          {reviews?.map((el) => (
            <Col span={24} md={8} className="text-center" key={el.id}>
              <Space direction="vertical" align="center">
                <Avatar size="large" src={getImageSrc(el.image)} />
                <Typography.Title level={5}>{el.title}</Typography.Title>
                <Typography.Paragraph className="text-xs m-0!">
                  {el.comment}
                </Typography.Paragraph>
                <Typography.Title level={5} className="m-0 text-xs">
                  {el.user}
                </Typography.Title>
              </Space>
            </Col>
          ))}
        </Row>
      </div>
    </ProductProvider>
  );
}
