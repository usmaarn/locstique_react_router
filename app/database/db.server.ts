import "dotenv/config";

import {
  drizzle,
  type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import * as schema from "./schema.server";
import * as relations from "./relations.server";
import postgres from "postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations,
  },
});

export type TX = PgTransaction<PostgresJsQueryResultHKT, any>;
