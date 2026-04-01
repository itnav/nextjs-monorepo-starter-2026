import { parse, string } from "valibot";

/** サーバー専用のデータベース接続 URL。`SECRET_DATABASE_URL` を検証した値。 */
export const SECRET_DATABASE_URL = /*#__PURE__*/ parse(string(), process.env.SECRET_DATABASE_URL);

/** サーバー専用のデータベース認証トークン。`SECRET_DATABASE_AUTH_TOKEN` を検証した値。 */
export const SECRET_DATABASE_AUTH_TOKEN = /*#__PURE__*/ parse(
  string(),
  process.env.SECRET_DATABASE_AUTH_TOKEN,
);
