import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../globals.css";
import { SiteFooter } from "../_components/site-footer";
import { SiteHeader } from "../_components/site-header";
import { SiteMain } from "../_components/site-main";

/** 本文用の Geist Sans フォント設定（CSS 変数 `--font-geist-sans`）。 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** 等幅用の Geist Mono フォント設定（CSS 変数 `--font-geist-mono`）。 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** ページ系ルートの Next.js メタデータ。 */
export const metadata: Metadata = {
  title: "Content",
  description: "Content application",
};

/**
 *  ページ用ルートレイアウト。HTML シェル + Header / Main / Footer。
 *
 *  @jsx
 */
export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col antialiased">
        <SiteHeader>
          <span className="text-lg font-semibold">Content</span>
        </SiteHeader>

        <SiteMain>{children}</SiteMain>

        <SiteFooter>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Content. All rights reserved.
          </p>
        </SiteFooter>
      </body>
    </html>
  );
}
