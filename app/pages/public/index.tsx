import HeroSection from "~/components/homepage/hero-section";
import type { Route } from "./+types";
import FeaturedProducts from "~/components/homepage/featured-products";
import BannerSection from "~/components/homepage/banner-section";
import FeaturesSection from "~/components/homepage/features-section";
import { settingsService } from "~/services/settings-service";
import { productService } from "~/services/product-service";
import { Link } from "react-router";
import { Button } from "antd";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Locstique | Your one stop fashion center." },
    { name: "description", content: "Welcome to Locstique!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const settings = await settingsService.get("home_page");
  const featuredProducts = await productService.queryProducts({ size: 4 });
  return { settings: settings?.value ?? {}, featuredProducts };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <HeroSection data={loaderData.settings} />
      <FeaturedProducts products={loaderData.featuredProducts} />
      <BannerSection />
      <FeaturesSection />

      <section className="p-8 md:py-12 lg:py-16 text-center space-y-8 max-w-4xl mx-auto">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          You Deserve the Best!
        </h3>
        <div className="space-y-3 text-sm lg:text-base tracking-wide leading-7">
          <p>
            We believe every woman <b>deserves to adorn herself</b> most finely,
            reflecting her individuality and confidence.
          </p>
          <p>
            Our curated collection of women's wear is metculously crafted to
            offer you <b>the best in style, quality</b>, and expression. Embrace
            the <b>luxury you deserve</b> and <b>redefine</b> your wardrobe with
            Locstique
          </p>
        </div>
        <Link to="/shop">
          <Button className="h-12! px-8!" type="primary">
            Explore our collection
          </Button>
        </Link>
      </section>
    </>
  );
}
