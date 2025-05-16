import {
  HeartOutlined,
  RollbackOutlined,
  StarOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Space, Typography } from "antd";

const features = [
  {
    icon: TruckOutlined,
    heading: "Fast & Secured Shipping",
    subheading: "Your Style, Delivered with Speed and Confidence",
  },
  {
    icon: HeartOutlined,
    heading: "100% Satisfaction Guarantee",
    subheading:
      "Shop confidently knowing that you are getting the best in style & fit.",
  },
  {
    icon: RollbackOutlined,
    heading: "Easy Returns",
    subheading: "Effortless Refunds for a Seamless Shopping Experience",
  },
  {
    icon: StarOutlined,
    heading: "Over 10,000 Glo Ups",
    subheading:
      "We've helpred over 10,000 girls feel & look their best with our products",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-neutral-100 py-10 px-4 space-y-12!">
      <Typography.Title
        level={3}
        className="text-center md:text-3xl! font-extrabold!"
      >
        The Locstique Promise
      </Typography.Title>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div key={index}>
            <Space direction="vertical" align="center">
              <feature.icon className="text-6xl! text-purple-600!" />
              <Typography.Title level={3} className="text-center font-bold">
                {feature.heading}
              </Typography.Title>
              <Typography.Paragraph className="m-0! text-center">
                {feature.subheading}
              </Typography.Paragraph>
            </Space>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
