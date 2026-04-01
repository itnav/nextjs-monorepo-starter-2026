import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { nowTimestampMsSql } from "./core/date";
import { uuidSql } from "./core/id";
import { userAuthAccountsTable } from "./user-auth-accounts";
import { userAuthSessionsTable } from "./user-auth-sessions";
import { userStatusEnum, userStatusEnumValues } from "./users.enum";

/**
 * Users テーブルの名前。
 */
export const usersTableName = "users";

/**
 * Users テーブル。
 */
export const usersTable = sqliteTable(
  usersTableName,
  {
    /**
     * 主キー（UUID）。
     */
    id: text().primaryKey().default(uuidSql),

    /**
     * 名前。
     */
    name: text().notNull(),

    /**
     * メールアドレス。
     */
    email: text().notNull(),

    /**
     * メールアドレスが確認されているかどうか。
     */
    emailVerified: integer({ mode: "boolean" }).notNull().default(false),

    /**
     * 画像URL。
     */
    imageUrl: text(),

    /**
     * ステータス。
     */
    status: text({ enum: userStatusEnumValues }).notNull().default(userStatusEnum.ACTIVE),

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
    const name = usersTableName;
    return [
      // メールアドレスでの検索を高速化し、重複を防ぐためのユニークインデックス。
      uniqueIndex(`${name}_email_unique`).on(table.email),

      // 論理削除されていないレコードの検索を高速化するためのインデックス。
      index(`${name}_deleted_at_idx`).on(table.deletedAt),
    ];
  },
);

/**
 * Users テーブルのリレーション。
 */
export const usersRelations = relations(usersTable, ({ many }) => ({
  /**
   * userAuthSessions テーブルへの one-to-many リレーション。
   */
  sessions: many(userAuthSessionsTable),

  /**
   * userAuthAccounts テーブルへの one-to-many リレーション。
   */
  accounts: many(userAuthAccountsTable),
}));
