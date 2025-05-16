import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { Button, Typography } from "antd";

const BannerSection = () => {
  return (
    <div className="md:grid grid-cols-3 mx-auto max-w-6xl px-3 py-8 rounded-2xl overflow-hidden">
      <div className="h-64 md:h-auto bg-pink-400 overflow-hidden">
        <img
          src="//glotique.co/cdn/shop/files/image22.png?v=1706809837&amp;width=1500"
          alt=""
          srcSet="//glotique.co/cdn/shop/files/image22.png?v=1706809837&amp;width=165 165w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&amp;width=360 360w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&amp;width=535 535w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&amp;width=750 750w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&amp;width=1070 1070w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&amp;width=1500 1500w"
          width="1500"
          height="999"
          loading="lazy"
          sizes="(min-width: 1400px) 650px,
              (min-width: 750px) calc((100vw - 130px) / 2), calc((100vw - 50px) / 2)"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="md:col-span-2 space-y-4! bg-primary p-10 md:p-16 text-center md:text-left">
        <Typography.Title className="text-white!">
          The Essence of Modern Beauty
        </Typography.Title>
        <div>
          <Typography.Paragraph className="text-gray-300!">
            Dedicated to empowering beauty through modern fashion
          </Typography.Paragraph>
          <Typography.Paragraph className="text-gray-300!">
            Our quality-driven, trend-conscious collections amplified each
            woman's unique elegance.
          </Typography.Paragraph>
        </div>
        <Link to="/shop" className="inline-block mt-5">
          <Button
            size="large"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            className="px-5! font-bold!"
          >
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BannerSection;
