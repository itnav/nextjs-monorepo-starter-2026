# Next.js 16 理解度テスト

この問題集は、Next.js 16 の App Router を実務で使う前提で理解できているかを確認するためのテストです。暗記ではなく、「どの責務をどこに置くか」「どの機能を選ぶべきか」を説明できる状態を目指してください。

## 環境セットアップ

```bash
pnpm create next-app@latest my-nextjs-test --yes
cd my-nextjs-test
pnpm dev
```

上記の前提として、この問題集では `create-next-app@latest --yes` で作成される Next.js 16 のデフォルト構成を扱います。TypeScript、Tailwind CSS、ESLint、App Router、Turbopack、`AGENTS.md` を含む構成を想定してください。

> 実際にコードを書いて動作確認しながら進めてください。

## ファイル構成

| ファイル | 内容 |
|---|---|
| [02__nextjs16_quiz_questions.md](./02__nextjs16_quiz_questions.md) | 問題のみ（全122問） |
| [03__nextjs16_quiz_answers.md](./03__nextjs16_quiz_answers.md) | 問題 + 回答（折りたたみ付き） |

## セクション一覧（小さい具体 → 大きい応用の順）

1. **ページとレイアウトの基本** — page.tsx、layout.tsx、template.tsx
2. **スタイリング** — Tailwind、CSS Modules、globals.css
3. **リンクとナビゲーション** — Link、useRouter、redirect、プリフェッチ
4. **ルーティング** — 動的ルート、Route Groups、Parallel / Intercepting Routes
5. **Server / Client Components** — `'use client'`、使い分け、合成パターン
6. **データフェッチ** — Server Components での fetch / ORM、ストリーミング
7. **Streaming と Suspense** — RSC Payload、Hydration、Selective Hydration
8. **Server Actions** — `'use server'`、API 比較、useActionState（12問）
9. **フォームとバリデーション** — useFormStatus、useOptimistic、Progressive Enhancement
10. **Route Handlers** — route.ts、HTTP メソッド、page.tsx との共存制限
11. **キャッシング** — `use cache`、`cacheLife`、Cache Components
12. **エラーハンドリング** — error.tsx、global-error.tsx、expected errors
13. **環境変数** — NEXT_PUBLIC\_、.env 優先順位、秘密情報の保護
14. **最適化** — next/image、next/font、Metadata API
15. **セキュリティとデータ保護** — server-only、taint API、認証チェック
16. **Turbopack** — webpack との違い、デフォルトバンドラー
17. **国際化と高度なルーティング** — i18n、generateStaticParams
18. **設定・デプロイ** — next.config.ts、middleware / proxy.ts
19. **テストとデバッグ** — ユニットテスト、E2E、logging
20. **総合演習** — ブログ設計、CRUD、認証フロー、パフォーマンス
21. **追加確認用ミニ課題** — 横断的な理解度チェック
