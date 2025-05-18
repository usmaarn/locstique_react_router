import { db } from "~/database/client.server";
import { usersTable } from "~/database/schema.server";
import type { UserType } from "~/lib/enums";
import type { registerSchema } from "~/schemas/user-schema";
import type { z } from "zod";
import * as argon2 from "argon2";

export const userService = {
  async findByEmail(email: string) {
    const result = db.query.usersTable.findFirst({
      where: (t, fn) => fn.eq(t.email, email),
    });
    return result;
  },

  async findByType(type: UserType) {
    return db.query.usersTable.findMany({
      where: (t, fn) => fn.eq(t.type, type),
    });
  },

  async create(dto: z.infer<typeof registerSchema>, type: UserType) {
    const result = await db
      .insert(usersTable)
      .values({
        name: dto.name,
        email: dto.email,
        type: type,
        password: await argon2.hash(dto.password),
      })
      .returning();
    return result[0];
  },
};
