import { Card, Col, Row, Statistic } from "antd";
import { useLoaderData } from "react-router";
import { PriceFormat } from "../price-format";

export function SectionCards() {
  const { revenue, customersCount, productsCount } = useLoaderData();
  return (
    <Row gutter={[24, 8]}>
      <Col span={24} md={8}>
        <Card>
          <Statistic
            title="Total Revenue"
            valueRender={() => <PriceFormat value={revenue} />}
          />
        </Card>
      </Col>

      <Col span={24} md={8}>
        <Card>
          <Statistic title="Total Customers" value={customersCount} />
        </Card>
      </Col>

      <Col span={24} md={8}>
        <Card>
          <Statistic title="Total Products" value={productsCount} />
        </Card>
      </Col>
    </Row>
  );
}
