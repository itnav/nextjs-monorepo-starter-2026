import { defineConfig } from "drizzle-kit";
import { parse } from "valibot";
import { envSchema } from "./src/bases/env";

/**
 * サーバー環境変数。
 */
const env = parse(envSchema, process.env);

/**
 * Drizzle の設定。
 */
export default defineConfig({
  dialect: "turso",
  casing: "snake_case",
  schema: "./src/schemas",
  out: "./src/migrations",
  dbCredentials: {
    url: env.SECRET_TURSO_CONNECTION_URL,
    authToken: env.SECRET_TURSO_AUTH_TOKEN,
  },
});
