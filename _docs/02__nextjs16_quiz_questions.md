# Next.js 16 理解度テスト — 問題編

> 概要・セットアップ手順は [01__nextjs16_quiz_overview.md](./01__nextjs16_quiz_overview.md) を参照

---

## 1. ページとレイアウトの基本

### Q1. App Router を使う場合、画面ルーティングの起点になるディレクトリはどこですか。また Pages Router の `pages/` とは何が違いますか。

### Q2. Root Layout が必須なのはなぜですか。最低限含めるべきタグも答えてください。

### Q3. `page.tsx` があることの意味は何ですか。フォルダだけでは公開ルートにならない理由も説明してください。

### Q4. `layout.tsx` と `template.tsx` の違いを説明してください。

### Q5. 演習: 新規プロジェクトで `/about` ページを追加し、Root Layout に共通ヘッダーを置いて、ページ遷移してもヘッダーが維持されることを確認してください。どのファイルを作りますか。

---

## 2. スタイリング

### Q6. `create-next-app --yes` で Tailwind CSS がデフォルトで有効になります。設定ファイルはどこにありますか。

### Q7. CSS Modules を使うにはファイル名をどうしますか。スコープがどう働くか説明してください。

### Q8. `globals.css` はどのファイルで import するのが一般的ですか。

### Q9. CSS-in-JS（styled-components, emotion 等）が Server Components で制限される理由を説明してください。

### Q10. 演習: `app/dashboard/page.module.css` を作り、スコープ付きスタイルを当ててください。

---

## 3. リンクとナビゲーション

### Q11. `next/link` の `Link` コンポーネントは `<a>` タグと比べて何が優れていますか。

### Q12. Client Component で動的にルート遷移するにはどの hook を使いますか。`router.push('/dashboard')` と `<Link href="/dashboard">` の使い分けを説明してください。

### Q13. Server Component 内でリダイレクトしたい場合、どの関数を使いますか。`redirect()` と `permanentRedirect()` の違いも答えてください。

### Q14. `usePathname()` と `useSearchParams()` はそれぞれ何を返しますか。

### Q15. `Link` コンポーネントのプリフェッチはどのタイミングで発生しますか。無効化する方法も答えてください。

### Q16. 演習: `/products` → `/products/[id]` → `/products/[id]/reviews` のパンくずリストを `Link` と `usePathname` で実装してください。

---

## 4. ルーティング

### Q17. `app/blog/[slug]/page.tsx` の `params` は Next.js 16 ではどの型になりますか。取り出し方も書いてください。

### Q18. `[slug]`、`[...slug]`、`[[...slug]]` の違いを説明してください。

### Q19. Route Groups の `(marketing)` は URL にどう影響しますか。また `_components` のような private folder は何のために使いますか。

### Q20. Parallel Routes の `@analytics` は何を表しますか。通常の `children` とどう違いますか。

### Q21. Intercepting Routes の `(.)`、`(..)`、`(...)` はどういうときに使いますか。

### Q22. `default.tsx` はどの場面で必要になりますか。

### Q23. 演習: `/docs`、`/docs/react`、`/docs/react/hooks` に対応する 1 つのページを作るには、どのようなフォルダ構成が考えられますか。

---

## 5. Server / Client Components

### Q24. App Router では、`page.tsx` と `layout.tsx` はデフォルトで Server Component と Client Component のどちらですか。

### Q25. Client Component にするために必要なディレクティブは何ですか。どこに書きますか。

### Q26. `useState`、`useEffect`、イベントハンドラ、`window.localStorage` はなぜ Server Component では使えませんか。

### Q27. Server Component から Client Component に `posts` を props で渡すのはなぜ一般的ですか。

### Q28. 次のコードの問題点は何ですか。

```tsx
import { useState } from 'react'

export default function Page() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Q29. `params` が Promise で渡される Client Component ページでは、どのように値を読む方法がありますか。

### Q30. 演習: 商品データ取得は Server Component、カートに追加ボタンだけ Client Component に分けてください。分離する理由も説明してください。

---

## 6. データフェッチ

### Q31. App Router では、データフェッチは主にどこで行うのが基本ですか。

### Q32. Next.js 16 では `fetch` はデフォルトでどのように扱われますか。

### Q33. 同一リクエスト中に同じ `fetch` を複数回呼んだ場合の挙動を説明してください。

### Q34. 次のコードのように Server Component から直接 DB 関数を呼べるのはなぜですか。

```tsx
export default async function Page() {
  const posts = await db.post.findMany()
  return <PostList posts={posts} />
}
```

### Q35. `searchParams` を使って一覧をフィルタしたい場合、Server Component と Client Component のどちらで扱うのが自然ですか。

### Q36. `loading.tsx` と `<Suspense>` はデータフェッチ時にどう使い分けますか。

### Q37. 演習: `app/products/page.tsx` で商品一覧、`app/products/loading.tsx` でスケルトンを出してください。何を確認すべきですか。

---

## 7. Streaming と Suspense

### Q38. RSC Payload（React Server Component Payload）とは何ですか。何が含まれていますか。

### Q39. Hydration（ハイドレーション）とは何ですか。なぜ必要ですか。

### Q40. Selective Hydration とは何ですか。Suspense とどう関係しますか。

### Q41. ストリーミングが TTFB（Time To First Byte）と FCP（First Contentful Paint）に与える影響を説明してください。

### Q42. 演習: 1 つのページに `<Suspense>` を 3 つ配置し、それぞれ異なる遅延のデータを取得して、段階的に表示されることを確認してください。

---

## 8. Server Actions

### Q43. Server Actions はどのディレクティブを使って定義しますか。

### Q44. `<form action={createPost}>` の `action` に Server Action を渡せる利点は何ですか。

### Q45. `useActionState` は何のために使いますか。

### Q46. Expected errors を扱うとき、Server Action では `throw` より何を返す設計が推奨されますか。

### Q47. 次の例で `useActionState` と相性が良い戻り値の形を考えてください。

```tsx
type FormState = {
  ok: boolean
  message: string
}
```

### Q48. 演習: タイトル未入力時にエラー文字列を表示し、成功時に一覧ページのキャッシュを無効化する投稿フォームを作ってください。使う API を列挙してください。

---

### Q49. Server Action と Route Handler（API エンドポイント）の違いは何ですか。それぞれどのような場面で使い分けますか。

### Q50. Server Action を使うメリットを Route Handler で同じことをする場合と比較して 3 つ挙げてください。

### Q51. Server Action が向かないケースを 2 つ挙げてください。

### Q52. Server Action で `redirect()` を呼ぶとき、`try/catch` の中で呼んではいけないのはなぜですか。

### Q53. Server Action の戻り値を使ってフォームの状態管理をする `useActionState` の基本的な使い方を書いてください。

### Q54. 演習: 以下の要件で Server Action を使った削除機能を実装してください。Route Handler で実装する場合との違いも比較してください。
- 記事 ID を受け取って削除
- 削除後に一覧ページへリダイレクト
- 認証チェック付き

---

## 9. フォームとバリデーション

### Q55. `useFormStatus` は何を返しますか。どのような場面で使いますか。

### Q56. Server Action を `<form action={...}>` に渡した場合、JavaScript が無効でもフォームは動作しますか。この性質を何と呼びますか。

### Q57. `useOptimistic` は何をする hook ですか。どのような UX 改善に使えますか。

### Q58. フォームバリデーションをクライアントだけでなくサーバー側でも行うべき理由を説明してください。

### Q59. 次のコードで `pending` を使って送信中にボタンを無効化する方法を書いてください。

```tsx
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  // ここを実装
}
```

### Q60. 演習: いいねボタンを `useOptimistic` で実装し、サーバー応答前に UI を更新してください。

---

## 10. Route Handlers

### Q61. Route Handler はどのファイル名で定義しますか。何の API を使って実装しますか。

### Q62. `page.tsx` と `route.ts` を同じセグメントに置けないのはなぜですか。

### Q63. Route Handlers でサポートされる代表的な HTTP メソッドを挙げてください。

### Q64. 動的セグメントの Route Handler で `id` を安全に取り出すにはどう書けますか。

### Q65. Page と比べて、Route Handler が「レイアウトやクライアント遷移に参加しない」とはどういう意味ですか。

### Q66. 演習: `app/api/health/route.ts` を作って `{"status":"ok"}` を返してください。ブラウザまたは `curl` で何を確認しますか。

---

## 11. キャッシング

### Q67. Next.js 16 で `use cache` を使う前提として、`next.config.ts` にはどの設定が必要ですか。

### Q68. `use cache` は何をするディレクティブですか。

### Q69. `cacheLife('hours')` のような API は何を表しますか。

### Q70. 「リクエストメモ化」と「永続的なキャッシュ」の違いを説明してください。

### Q71. `revalidatePath('/products')` と `revalidateTag('products')` はどう使い分けますか。

### Q72. 演習: 商品作成後に一覧を最新化したいです。`/products` だけ再取得すればよいケースと、商品データを参照する複数ページをまとめて更新したいケースで、どちらを使いますか。

---

## 12. エラーハンドリング

### Q73. `error.tsx` は何のためのファイルですか。

### Q74. `global-error.tsx` はどのような場面で使いますか。

### Q75. `not-found.tsx` はいつ表示されますか。

### Q76. 想定内のバリデーションエラーを Server Action で扱うとき、`try/catch` より戻り値を使うのがよいのはなぜですか。

### Q77. 演習: `app/posts/[slug]/error.tsx` と `app/posts/[slug]/not-found.tsx` を作り、例外時と未存在時で別 UI が出ることを確認してください。どうテストしますか。

---

## 13. 環境変数

### Q78. `NEXT_PUBLIC_` プレフィックスがついた環境変数とそうでないものの違いは何ですか。

### Q79. `.env`、`.env.local`、`.env.production` の読み込み優先順位を説明してください。

### Q80. Server Component でのみ使いたい API キーは、なぜ `NEXT_PUBLIC_` をつけてはいけないですか。

### Q81. `process.env.DATABASE_URL` を Client Component で参照するとどうなりますか。

### Q82. 演習: `.env.local` に `API_SECRET=xxx` を定義し、Server Component でのみ参照できることを確認してください。

---

## 14. 最適化

### Q83. `next/image` を使う利点を 2 つ挙げてください。

### Q84. `next/font` を使うと何が改善されますか。

### Q85. Metadata は `export const metadata` と `generateMetadata` をどう使い分けますか。

### Q86. `favicon.ico`、`opengraph-image.tsx`、`robots.txt` などのファイル規約は何のためにありますか。

### Q87. `loading.tsx` や `<Suspense>` を使ったストリーミングは、体感性能にどう効きますか。

### Q88. 演習: 商品詳細ページに `generateMetadata` と `opengraph-image.tsx` を追加してください。何を確認するとよいですか。

---

## 15. セキュリティとデータ保護

### Q89. `server-only` パッケージは何をするものですか。どのように使いますか。

### Q90. Server Actions は UI 経由以外でも直接 POST リクエストで呼び出せます。なぜ認証チェックが必須ですか。

### Q91. `NEXT_PUBLIC_` をつけない環境変数がクライアントバンドルに含まれないのはなぜですか。

### Q92. `taint` API（`experimental_taintObjectReference`）は何を防ぐためのものですか。

### Q93. 演習: `server-only` を import して、Client Component からその関数を呼ぼうとするとどうなるか確認してください。

---

## 16. Turbopack

### Q94. Turbopack とは何ですか。webpack と比べた主な違いを説明してください。

### Q95. Next.js 16 の `create-next-app --yes` で dev サーバーは何で動きますか。

### Q96. Turbopack が対応していない webpack プラグインがある場合、どう対処しますか。

### Q97. 演習: `pnpm dev` 実行時にターミナルに Turbopack の表示が出ることを確認してください。

---

## 17. 国際化と高度なルーティング

### Q98. App Router で i18n を実現する基本パターンとして `[locale]` セグメントを使う方法を説明してください。

### Q99. `generateStaticParams` は何のために使いますか。使用例を書いてください。

### Q100. proxy（middleware）でロケールを振り分けるパターンを説明してください。

### Q101. `generateStaticParams` を使わずに動的ルートをビルドするとどうなりますか。

### Q102. 演習: `/ja/about` と `/en/about` で言語切り替えできるルーティングを構築してください。

---

## 18. 設定・デプロイ

### Q103. Next.js 16 では設定ファイルとして何を使うのが基本ですか。

### Q104. Next.js 16 における `proxy.ts` は何ですか。`middleware.ts` との関係も答えてください。

### Q105. `proxy.ts` を重いデータフェッチや本格的な認可処理の中心にすべきでないのはなぜですか。

### Q106. デプロイ前に最低限確認したいこととして、このプロジェクトの運用ルール上は何を実行すべきですか。

### Q107. `cacheComponents: true` を有効にしたプロジェクトで、キャッシュ戦略を決めずに実装を進めると何が起きやすいですか。

### Q108. 演習: `next.config.ts` に `cacheComponents: true` を追加し、`proxy.ts` で `/admin` だけを保護し、`vp check` まで実行してください。確認観点を 3 つ挙げてください。

---

## 19. テストとデバッグ

### Q109. Next.js アプリのユニットテストで、Server Component をテストする際の課題は何ですか。

### Q110. Route Handler の単体テストはどのように書けますか。

### Q111. Next.js の `next.config.ts` で `logging` を有効にすると何がわかりますか。

### Q112. Playwright や Cypress を使った E2E テストで、Next.js アプリをテストする際の基本的な流れを説明してください。

### Q113. 演習: `app/api/health/route.ts` に対するユニットテストを書いてください。

---

## 20. 総合演習

### Q114. ブログアプリを設計するとき、`layout.tsx`、`page.tsx`、`loading.tsx`、`error.tsx` をどのセグメントに配置しますか。ディレクトリ構成を書いてください。

### Q115. CRUD 操作を Server Action + `revalidatePath` で実装するパターンを説明してください。

### Q116. 認証フローを proxy + Server Component + Client Component で設計する場合、それぞれの責務は何ですか。

### Q117. Next.js アプリのパフォーマンス最適化チェックリストを 5 項目挙げてください。

### Q118. あるコンポーネントを Server Component にするか Client Component にするか迷ったとき、判断基準は何ですか。

### Q119. 演習: 以下の要件でミニブログを構築するステップを書いてください。
- 記事一覧（Server Component）
- 記事詳細（動的ルート、`generateMetadata`）
- 記事作成フォーム（Server Action、`useActionState`）
- エラー・ローディング UI

---

## 21. 追加確認用ミニ課題

### Q120. `layout.tsx` は state を保持し再レンダーされにくい一方で、`template.tsx` は毎回作り直されます。フォーム入力を保持したい共通サイドバーはどちらに置くべきですか。

### Q121. `app/users/[id]/page.tsx` で `const { id } = params` と書くと Next.js 16 では何が問題になりますか。

### Q122. App Router で「一覧は Server Component、絞り込み UI は Client Component、更新は Server Action、外部連携 API は Route Handler」という分担はなぜ筋が良いですか。

---
