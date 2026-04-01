import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { nowTimestampMsSql } from "./core/date";
import { uuidSql } from "./core/id";
import { usersTable } from "./users";

/**
 * User Sessions テーブルの名前。
 */
export const userAuthSessionsTableName = "user_auth_sessions";

/**
 * User Sessions テーブル。
 */
export const userAuthSessionsTable = sqliteTable(
  userAuthSessionsTableName,
  {
    /**
     * 主キー（UUID）。
     */
    id: text().primaryKey().default(uuidSql),

    /**
     * ユーザーID。
     */
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    /**
     * トークン。
     */
    token: text().notNull(),

    /**
     * 有効期限。
     */
    expiresAt: integer().notNull(),

    /**
     * IPアドレス。
     */
    ipAddress: text(),

    /**
     * ユーザーエージェント。
     */
    userAgent: text(),

    /**
     * アクティブな組織ID。
     */
    activeOrganizationId: text(),

    /**
     * アクティブなチームID。
     */
    activeTeamId: text(),

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
    const name = userAuthSessionsTableName;
    return [
      // ユーザーIDでの検索を高速化するためのインデックス。
      index(`${name}_user_id_idx`).on(table.userId),

      // トークンでの検索を高速化し、重複を防ぐためのユニークインデックス。
      uniqueIndex(`${name}_token_unique`).on(table.token),

      // 有効期限切れのセッションを効率的に検索・削除するためのインデックス。
      index(`${name}_expires_at_index`).on(table.expiresAt),

      // 論理削除されていないレコードの検索を高速化するためのインデックス。
      index(`${name}_deleted_at_idx`).on(table.deletedAt),
    ];
  },
);

/**
 * ユーザーセッションのリレーション。
 */
export const userAuthSessionsRelations = relations(userAuthSessionsTable, ({ one }) => ({
  /**
   * users テーブルへの one-to-one リレーション。
   */
  user: one(usersTable, {
    fields: [userAuthSessionsTable.userId],
    references: [usersTable.id],
  }),
}));
