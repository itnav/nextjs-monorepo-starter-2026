import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nowTimestampMsSql } from "./core/date";
import { uuidSql } from "./core/id";
import { usersTable } from "./users";

/**
 * User Accounts テーブルの名前。
 */
export const userAuthAccountsTableName = "user_auth_accounts";

/**
 * User Accounts テーブル。
 */
export const userAuthAccountsTable = sqliteTable(
  userAuthAccountsTableName,
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
     * アカウントID。
     */
    accountId: text().notNull(),

    /**
     * プロバイダーID。
     */
    providerId: text().notNull(),

    /**
     * アクセストークン。
     */
    accessToken: text(),

    /**
     * リフレッシュトークン。
     */
    refreshToken: text(),

    /**
     * アクセストークンの有効期限。
     */
    accessTokenExpiresAt: integer(),

    /**
     * リフレッシュトークンの有効期限。
     */
    refreshTokenExpiresAt: integer(),

    /**
     * スコープ。
     */
    scope: text(),

    /**
     * IDトークン。
     */
    idToken: text(),

    /**
     * パスワード。
     */
    password: text(),

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
    const name = userAuthAccountsTableName;
    return [
      // ユーザーIDでの検索を高速化するためのインデックス。
      index(`${name}_user_id_idx`).on(table.userId),

      // 論理削除されていないレコードの検索を高速化するためのインデックス。
      index(`${name}_deleted_at_idx`).on(table.deletedAt),
    ];
  },
);

/**
 * ユーザーアカウントのリレーション。
 */
export const userAuthAccountsRelations = relations(userAuthAccountsTable, ({ one }) => ({
  /**
   * users テーブルへの one-to-one リレーション。
   */
  user: one(usersTable, {
    fields: [userAuthAccountsTable.userId],
    references: [usersTable.id],
  }),
}));
