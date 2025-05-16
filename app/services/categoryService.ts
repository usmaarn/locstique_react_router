import { db } from "@/database";
import { categoriesTable } from "@/database/schema";
import type { CreateCategoryDto } from "@/validations/category";
import { eq } from "drizzle-orm";

export const categoryService = {
  find: async () => {
    return db.query.categoriesTable.findMany();
  },

  create: async (dto: CreateCategoryDto) => {
    const result = await db
      .insert(categoriesTable)
      .values({
        name: dto.name,
        description: dto.description,
      })
      .returning();
    return result[0];
  },

  delete: async (id: string) => {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  },
};
