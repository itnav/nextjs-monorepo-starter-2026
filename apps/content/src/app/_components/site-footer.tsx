import { type ComponentProps } from "react";

import { cn } from ":/libs/shadcn/utils";

/** `<footer>` に渡すプロップ。`ComponentProps<'footer'>` をそのまま拡張する。 */
export interface SiteFooterProps extends ComponentProps<"footer"> {}

/** サイトフッター。上罫線とパディング付きの `<footer>`。 */
export function SiteFooter({ children, className, ...props }: SiteFooterProps) {
  return (
    <footer className={cn("bg-background border-t px-6 py-4", className)} {...props}>
      {children}
    </footer>
  );
}
