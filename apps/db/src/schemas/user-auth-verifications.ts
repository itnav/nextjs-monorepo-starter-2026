import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nowTimestampMsSql } from "./core/date";
import { uuidSql } from "./core/id";

/**
 * User Verifications テーブルの名前。
 */
export const userAuthVerificationsTableName = "user_auth_verifications";

/**
 * User Verifications テーブル。
 */
export const userAuthVerificationsTable = sqliteTable(
  userAuthVerificationsTableName,
  {
    /**
     * 主キー（UUID）。
     */
    id: text().primaryKey().default(uuidSql),

    /**
     * 識別子。
     */
    identifier: text().notNull(),

    /**
     * 値。
     */
    value: text().notNull(),

    /**
     * 有効期限。
     */
    expiresAt: integer().notNull(),

    /**
     * 作成日時。
     */
    createdAt: integer().notNull().default(nowTimestampMsSql),

    /**
     * 更新日時。
     */
    updatedAt: integer(),

    /**
     * 削除日時（論理削除）。
     */
    deletedAt: integer(),
  },
  (table) => {
    const name = userAuthVerificationsTableName;
    return [
      // 識別子（メールアドレスなど）での検索を高速化するためのインデックス。
      index(`${name}_identifier_index`).on(table.identifier),

      // 有効期限切れのレコードを効率的に検索・削除するためのインデックス。
      index(`${name}_expires_at_index`).on(table.expiresAt),

      // 論理削除されていないレコードの検索を高速化するためのインデックス。
      index(`${name}_deleted_at_idx`).on(table.deletedAt),
    ];
  },
);
