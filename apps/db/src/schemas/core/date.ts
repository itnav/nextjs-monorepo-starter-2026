import { sql } from "drizzle-orm";

/**
 * 実行日のタイムスタンプを生成する SQL 式。
 */
export const nowTimestampMsSql = /*#__PURE__*/ sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`;
