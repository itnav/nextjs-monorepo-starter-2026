import { createDBClient, type DBClient } from "@apps/database";
import { SECRET_DATABASE_AUTH_TOKEN, SECRET_DATABASE_URL } from ":/bases/env.server";

/** Content アプリ用の Drizzle DB クライアント（サーバー環境変数から生成）。 */
export const dbProvider: DBClient = createDBClient({
  url: SECRET_DATABASE_URL,
  authToken: SECRET_DATABASE_AUTH_TOKEN,
});
