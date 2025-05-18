import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  type UploadFile,
} from "antd";
import { data, redirect, useFetcher } from "react-router";
import { Editor } from "~/components/editor";
import ImageUpload from "~/components/image-upload";
import type { Route } from "./+types/edit-product";
import { validateSchema } from "~/lib/helper.server";
import { updateProductSchema } from "~/schemas/product-schema";
import { productService } from "~/services/product-service.server";
import { setFieldErrors } from "~/lib/utils";

export async function loader({ params }: Route.LoaderArgs) {
  const product = await productService.findById(params.id);
  if (!product) throw data({ message: "Page Not Found" }, 404);
  return { product };
}

export async function action({ request, params }: Route.ActionArgs) {
  const data = await request.json();
  const validated = await validateSchema(updateProductSchema, {
    ...data,
    id: params.id,
  });

  if (validated.errors) {
    return { errors: validated.errors };
  }
  const product = await productService.findById(params.id);
  if (product) {
    await productService.update(product, validated.data);
    return redirect("/dashboard/products");
  }
  return { error: "Unable to update product" };
}

export default function Page({
  loaderData: { product },
}: Route.ComponentProps) {
  const fetcher = useFetcher();
  const [form] = Form.useForm();

  function handleSubmit(values: any) {
    fetcher.submit(values, { method: "POST", encType: "application/json" });
  }

  setFieldErrors(form, fetcher.data?.errors);

  return (
    <Card title="Edit Product">
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={product}
      >
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Product Images"
          name="images"
          rules={[{ required: true }]}
        >
          <ImageUpload
            initialValue={product.images}
            onChange={(v: UploadFile[]) =>
              form.setFieldValue(
                "images",
                v.map((el) => el.response ?? el.uid)
              )
            }
          />
        </Form.Item>

        <Row gutter={24}>
          <Col span={24} md={12}>
            <Form.Item
              label="Product Price"
              name="price"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              label="Product In Stock"
              name="stock"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item label="Product Discount(%)" name="discount">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item label="Product Tag" name="tag">
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Product Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Editor initialValue={product.description} />
        </Form.Item>

        <Form.Item label="Product Details" name="details">
          <Editor initialValue={product.details} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={fetcher.state != "idle"}
        >
          Update Product
        </Button>
      </Form>
    </Card>
  );
}
