import { Card, Col, List, Row, Skeleton, Space } from "antd";

export function CheckoutFallback() {
  return (
    <Row gutter={[24, 24]} className="p-3 max-w-6xl mx-auto! mb-12!">
      <Col span={24} md={16}>
        <Space direction="vertical" size="large" className="w-full">
          <Card>
            <List
              dataSource={[1, 2]}
              renderItem={() => (
                <Skeleton avatar paragraph={{ rows: 2 }} loading />
              )}
            />
          </Card>
          <Card>
            <Skeleton.Input className="w-full! h-16!" />
          </Card>
        </Space>
      </Col>

      <Col span={24} md={8}>
        <Card>
          <Skeleton loading paragraph />
          <Skeleton.Button className="w-full! mt-4" />
        </Card>
      </Col>
    </Row>
  );
}
