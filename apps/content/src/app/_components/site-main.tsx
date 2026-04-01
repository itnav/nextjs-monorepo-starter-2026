import { type ComponentProps } from "react";

import { cn } from ":/libs/shadcn/utils";

/** `<main>` に渡すプロップ。`ComponentProps<'main'>` をそのまま拡張する。 */
export interface SiteMainProps extends ComponentProps<"main"> {}

/** メインラッパー。中央寄せ・最大幅・余白を付与した `<main>`。 */
export function SiteMain({ children, className, ...props }: SiteMainProps) {
  return (
    <main className={cn("mx-auto w-full max-w-6xl flex-1 px-6 py-8", className)} {...props}>
      {children}
    </main>
  );
}
