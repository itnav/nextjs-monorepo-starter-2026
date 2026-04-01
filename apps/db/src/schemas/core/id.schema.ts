import { pipe, regex, string } from "valibot";

/**
 * UUID（24文字の大文字16進数）のバリデーションスキーマ。
 *
 * 24文字の大文字16進数文字列であることを検証する。 形式: [0-9A-F]{24}（例: A1B2C3D4E5F6G7H8I9J0K1L2）
 *
 * 内部構成: タイムスタンプ12桁 + ランダム12桁
 */
export const uuidSchema = /*#__PURE__*/ pipe(
  string("IDは文字列である必要があります"),
  regex(/^[0-9A-F]{24}$/, "IDの形式が正しくありません（24文字の大文字16進数である必要があります）"),
);

/**
 * UUID（24文字の大文字16進数）を生成する。
 *
 * ブラウザ環境とNode.js環境の両方で動作する。
 *
 * @returns 24 文字の大文字 16 進数文字列
 */
export function generateUUID(): string {
  const randomBytes = new Uint8Array(12);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < 12; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }

  return [...randomBytes].map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join("");
}
