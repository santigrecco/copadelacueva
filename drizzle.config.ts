import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // host: "localhost",
    // port: 5432,
    // user: "postgres",
    // password: undefined,
    // database: "copadelacueva",
    url: process.env.DATABASE_URL || "",
  },
} satisfies Config;
