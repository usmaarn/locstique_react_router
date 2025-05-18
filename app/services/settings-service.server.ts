import { db } from "~/database/client.server";
import { settingsTable } from "~/database/schema.server";

export const settingsService = {
  async get(name: string) {
    const record = await db.query.settingsTable.findFirst({
      where: (t, fn) => fn.eq(t.name, name),
    });
    return record;
  },

  async set(name: string, value: any) {
    const result = await db
      .insert(settingsTable)
      .values({ name, value })
      .onConflictDoUpdate({
        target: settingsTable.name,
        set: { value },
      })
      .returning();
    return result[0];
  },
};
