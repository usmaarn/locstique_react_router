import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { Button, Typography } from "antd";

const HeroSection = ({ data }: { data: any }) => {
  return (
    <section
      style={{
        backgroundImage: `linear-gradient(to right, rgba(10, 10, 10, 0.654), rgba(78, 4, 64, 0.777)), url(${data?.bg_image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="hero h-96 md:h-[36rem] bg-black flex flex-col text-white  gap-5 items-center justify-center "
    >
      <Typography.Title className="text-white! font-black">
        {data?.hero_heading}
      </Typography.Title>
      <Typography.Paragraph style={{ color: "white" }}>
        {data?.sub_heading}
      </Typography.Paragraph>
      <Link to="/shop">
        <Button
          size="large"
          icon={<ArrowRightOutlined />}
          variant="outlined"
          className="font-bold! bg-transparent! border-2! text-white! px-8! py-6!"
          iconPosition="end"
        >
          Shop Now
        </Button>
      </Link>
    </section>
  );
};

export default HeroSection;
