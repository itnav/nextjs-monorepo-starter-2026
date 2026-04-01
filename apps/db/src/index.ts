import { drizzle } from "drizzle-orm/libsql";

/**
 * データベースのクライアントのパラメーター。
 */
export interface DBClientParams {
  url: string;
  authToken: string;
}

/**
 * Drizzle ORM のクライアントを作成する関数。
 *
 * @param   params パラメーター
 *
 * @returns        データベースのクライアント
 */
export function createDBClient(params: DBClientParams) {
  return drizzle({
    casing: "snake_case",
    connection: {
      url: params.url,
      authToken: params.authToken,
    },
  });
}

/**
 * データベースのクライアントの型。
 */
export type DBClient = ReturnType<typeof createDBClient>;
