import { Button, Form, Input, message, Spin } from "antd";
import { useEffect } from "react";
import { useFetcher, useLoaderData, useParams } from "react-router";
import { Editor } from "../editor";

export function PageSettings() {
  const { settings } = useLoaderData();
  const fetcher = useFetcher();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("title", settings.title);
    form.setFieldValue("content", settings.content);
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
      >
        <Form.Item label="Heading" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Content" name="content">
          <Editor initialValue={settings.content} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={fetcher.state != "idle"}
        >
          Save Changes
        </Button>
      </Form>
    </Spin>
  );
}
