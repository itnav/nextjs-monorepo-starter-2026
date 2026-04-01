import { parse, picklist } from "valibot";

/** 公開環境名。`NEXT_PUBLIC_ENVIRONMENT` を Valibot で検証した値。 */
export const ENVIRONMENT = /*#__PURE__*/ parse(
  picklist(["development", "staging", "production", "testing"]),
  process.env.NEXT_PUBLIC_ENVIRONMENT,
);
