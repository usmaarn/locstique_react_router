import { Button, Collapse, Form, Input, message, Spin } from "antd";
import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";

const HomePageSettings = () => {
  const fetcher = useFetcher();
  const { settings } = useLoaderData();

  const items = [
    {
      key: "hero",
      label: "Hero Section",
      children: (
        <HeroSettings
          data={settings}
          onSave={(v) =>
            fetcher.submit(v, { method: "PUT", encType: "application/json" })
          }
        />
      ),
    },
  ];

  useEffect(() => {
    if (fetcher.data?.success) {
      message.success("changes saved!");
    }
  }, [fetcher.data]);

  return (
    <Spin spinning={fetcher.state != "idle"}>
      <Collapse items={items} defaultActiveKey={["hero"]} />
    </Spin>
  );
};

function HeroSettings({
  data,
  onSave,
}: Readonly<{
  data: any;
  onSave: (values: any) => void;
}>) {
  const [form] = Form.useForm();
  return (
    <Form
      layout="vertical"
      initialValues={data}
      form={form}
      onFinish={(values) => onSave({ ...data, ...values })}
    >
      <Form.Item label="Heading" name="hero_heading">
        <Input />
      </Form.Item>
      <Form.Item label="Sub Heading" name="sub_heading">
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Background Image Url" name="bg_image">
        <Input type="url" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Save Changes
      </Button>
    </Form>
  );
}

export default HomePageSettings;
