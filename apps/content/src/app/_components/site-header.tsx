import { type ComponentProps } from "react";

import { cn } from ":/libs/shadcn/utils";

/** `<header>` に渡すプロップ。`ComponentProps<'header'>` をそのまま拡張する。 */
export interface SiteHeaderProps extends ComponentProps<"header"> {}

/** サイトヘッダー。下罫線と横並びレイアウト付きの `<header>`。 */
export function SiteHeader({ children, className, ...props }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "bg-background border-b px-6 py-4",
        "flex items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
}
