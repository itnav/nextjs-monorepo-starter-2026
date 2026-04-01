import { object, string } from "valibot";

/**
 * 環境変数のスキーマ。
 */
export const envSchema = object({
  SECRET_TURSO_CONNECTION_URL: string(),
  SECRET_TURSO_AUTH_TOKEN: string(),
});
