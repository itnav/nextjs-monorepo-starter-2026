import { parse, string } from "valibot";

/** 公開アプリのベース URL。`NEXT_PUBLIC_APP_URL` を検証した値。 */
export const PUBLIC_APP_URL = /*#__PURE__*/ parse(string(), process.env.NEXT_PUBLIC_APP_URL);
