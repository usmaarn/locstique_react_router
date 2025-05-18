import { Button, Form, Input, message, Select, Spin } from "antd";
import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";

export function PaymentSettings() {
  const { settings } = useLoaderData();
  const fetcher = useFetcher();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("secret_key", settings.secret_key);
    form.setFieldValue("currency", settings.currency);
    form.setFieldValue("redirect_url", settings.redirect_url);
  }, [settings]);

  useEffect(() => {
    if (fetcher.data?.success) {
      message.success("changes saved!");
    }
  }, [fetcher.data]);

  return (
    <Spin spinning={fetcher.state != "idle"}>
      <Form
        initialValues={settings}
        layout="vertical"
        onFinish={(v) =>
          fetcher.submit(v, { method: "PUT", encType: "application/json" })
        }
        form={form}
        className="grid md:grid-cols-2 gap-x-5"
      >
        <Form.Item
          label="Flutterwave Secret Key"
          name="secret_key"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Currency"
          name="currency"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Naira", value: "NGN" },
              { label: "Dollar", value: "USD" },
              { label: "Euro", value: "EUR" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Redirect Url"
          name="redirect_url"
          tooltip="Url to redirect to after payment is processed"
          rules={[{ required: true }]}
        >
          <Input type="url" />
        </Form.Item>
        <Form.Item className="md:col-span-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={fetcher.state != "idle"}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}
