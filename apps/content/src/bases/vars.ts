import { ENVIRONMENT } from ":/bases/env";

/** クライアント（ブラウザ）で実行されているか。`globalThis.window` の有無で判定する。 */
export const IS_CLIENT = /*#__PURE__*/ globalThis.window !== undefined;

/** 開発環境（`NEXT_PUBLIC_ENVIRONMENT` が `development`）かどうか。 */
export const IS_DEVELOPMENT = /*#__PURE__*/ ENVIRONMENT === "development";

/** ステージング環境かどうか。 */
export const IS_STAGING = /*#__PURE__*/ ENVIRONMENT === "staging";

/** 本番環境かどうか。 */
export const IS_PRODUCTION = /*#__PURE__*/ ENVIRONMENT === "production";

/** テスト実行時の環境かどうか。 */
export const IS_TESTING = /*#__PURE__*/ ENVIRONMENT === "testing";
