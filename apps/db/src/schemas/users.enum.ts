/**
 * ユーザーのステータス。
 */
export const userStatusEnum = /*#__PURE__*/ {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

/**
 * ユーザーステータスのリスト。
 */
export const userStatusEnumValues = /*#__PURE__*/ [
  userStatusEnum.ACTIVE,
  userStatusEnum.INACTIVE,
] as const;
