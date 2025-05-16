import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import * as relations from "./relations";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations,
  },
});
