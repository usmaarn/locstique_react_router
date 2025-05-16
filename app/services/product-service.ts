import { db } from "~/database";
import { type Product, productsTable } from "~/database/schema";
import { eq } from "drizzle-orm";
import type {
  CreateProductDto,
  UpdateProductDto,
} from "~/schemas/product-schema";
import { uploadService } from "./file-service";

export const productService = {
  async queryProducts(query: any): Promise<Product[]> {
    const size = query?.size ? parseInt(query.size) : undefined;
    const page = query?.page ? parseInt(query.page) : undefined;

    return await db.query.productsTable.findMany({
      where: (t, fn) =>
        fn.and(
          query?.id && fn.inArray(t.id, query.id),
          query?.name && fn.ilike(t.name, query.name)
        ),
      limit: size,
      offset: page && size ? (page > 1 ? page - 1 : 1) * size : undefined,
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });
  },

  async findById(id: string): Promise<Product | undefined> {
    return db.query.productsTable.findFirst({
      where: (t, fn) => fn.eq(t.id, id),
    });
  },

  async create(dto: CreateProductDto): Promise<Product> {
    const images: string[] = [];

    for (const image of dto.images) {
      images.push(await uploadService.storeFile(image, "products"));
    }

    const result = await db
      .insert(productsTable)
      .values({
        name: dto.name,
        discount: dto.discount,
        description: dto.description,
        details: dto.details,
        price: dto.price,
        stock: dto.stock,
        images,
        tag: dto.tag,
      })
      .returning();
    return result[0];
  },

  async update(product: Product, dto: UpdateProductDto): Promise<Product> {
    const images: string[] = [];

    const imagesToDelete = (product.images as string[]).filter(
      (image) => !dto.images.includes(image)
    );

    for (const image of imagesToDelete) {
      await uploadService.deleteFile(image);
    }

    for (const image of dto.images) {
      images.push(await uploadService.storeFile(image, "products"));
    }

    const result = await db
      .update(productsTable)
      .set({
        name: dto.name,
        discount: dto.discount,
        description: dto.description,
        details: dto.details,
        price: dto.price,
        stock: dto.stock,
        images,
        tag: dto.tag,
      })
      .where(eq(productsTable.id, dto.id))
      .returning();
    return result[0];
  },

  async delete(product: Product): Promise<void> {
    for (let image of product.images as string[]) {
      await uploadService.deleteFile(image);
    }
    await db.delete(productsTable).where(eq(productsTable.id, product.id));
  },
};
