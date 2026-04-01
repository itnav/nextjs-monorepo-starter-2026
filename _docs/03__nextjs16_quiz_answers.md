# Next.js 16 理解度テスト — 回答編

> 概要・セットアップ手順は [01__nextjs16_quiz_overview.md](./01__nextjs16_quiz_overview.md) を参照

---

## 1. ページとレイアウトの基本

### Q1. App Router を使う場合、画面ルーティングの起点になるディレクトリはどこですか。また Pages Router の `pages/` とは何が違いますか。

<details><summary>回答</summary>

起点は `app/` ディレクトリです。App Router では、`page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx` などの特別なファイル規約を使って UI・レイアウト・ローディング・エラー境界を構成します。`pages/` は従来の Pages Router 用です。

</details>

### Q2. Root Layout が必須なのはなぜですか。最低限含めるべきタグも答えてください。

<details><summary>回答</summary>

App Router では、アプリ全体の共通レイアウトの起点として Root Layout が必須です。最低限 `html` と `body` タグを含める必要があります。

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
```

</details>

### Q3. `page.tsx` があることの意味は何ですか。フォルダだけでは公開ルートにならない理由も説明してください。

<details><summary>回答</summary>

`page.tsx` は、そのセグメントを公開可能な URL として成立させるファイルです。フォルダだけではルートセグメントの定義に過ぎず、公開 UI は作られません。

例:

```text
app/
  dashboard/
    analytics/
      page.tsx   -> /dashboard/analytics
```

`analytics/` フォルダだけで `page.tsx` がない場合、そのパスを直接表示するページにはなりません。

</details>

### Q4. `layout.tsx` と `template.tsx` の違いを説明してください。

<details><summary>回答</summary>

`layout.tsx` はナビゲーション間で維持され、状態を保持し、再レンダーされにくい共有 UI です。`template.tsx` はナビゲーションごとに新しくインスタンス化されるため、毎回作り直したい UI に向いています。

使い分けの目安:

- 入力状態やサイドバー状態を保持したいなら `layout.tsx`
- ページ遷移ごとに再実行したいアニメーションや一時 UI なら `template.tsx`

</details>

### Q5. 演習: 新規プロジェクトで `/about` ページを追加し、Root Layout に共通ヘッダーを置いて、ページ遷移してもヘッダーが維持されることを確認してください。どのファイルを作りますか。

<details><summary>回答</summary>

最低限、以下を作ります。

```text
app/
  layout.tsx
  page.tsx
  about/
    page.tsx
```

例:

```tsx
// app/layout.tsx
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <header>
          <Link href="/">Home</Link> | <Link href="/about">About</Link>
        </header>
        {children}
      </body>
    </html>
  )
}
```

`/` と `/about` を行き来し、共通ヘッダーが維持されることを確認します。

</details>

---

## 2. スタイリング

### Q6. `create-next-app --yes` で Tailwind CSS がデフォルトで有効になります。設定ファイルはどこにありますか。

<details><summary>回答</summary>

`postcss.config.mjs` が Tailwind の PostCSS 設定として機能します。Tailwind v4 以降はゼロコンフィグが基本で、CSS ファイル内の `@import "tailwindcss"` で有効になります。

</details>

### Q7. CSS Modules を使うにはファイル名をどうしますか。スコープがどう働くか説明してください。

<details><summary>回答</summary>

`.module.css` 拡張子にします。クラス名がビルド時にユニーク化されるため、他のコンポーネントとスタイルが衝突しません。

```tsx
import styles from './page.module.css'

export default function Page() {
  return <h1 className={styles.title}>Hello</h1>
}
```

</details>

### Q8. `globals.css` はどのファイルで import するのが一般的ですか。

<details><summary>回答</summary>

`app/layout.tsx`（Root Layout）で import するのが一般的です。Root Layout はすべてのページで共有されるため、グローバルスタイルの適用先として適切です。

```tsx
import './globals.css'
```

</details>

### Q9. CSS-in-JS（styled-components, emotion 等）が Server Components で制限される理由を説明してください。

<details><summary>回答</summary>

CSS-in-JS ライブラリはランタイムで JS を実行してスタイルを生成するため、サーバーで実行される Server Components とは相性が悪いです。Client Component に限定して使うか、Tailwind や CSS Modules のようなビルド時に解決されるスタイリング手法を使う必要があります。

</details>

### Q10. 演習: `app/dashboard/page.module.css` を作り、スコープ付きスタイルを当ててください。

<details><summary>回答</summary>

```css
/* app/dashboard/page.module.css */
.container {
  padding: 2rem;
  background: #f5f5f5;
}
.title {
  color: #333;
  font-size: 1.5rem;
}
```

```tsx
// app/dashboard/page.tsx
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
    </div>
  )
}
```

devtools で確認すると、クラス名が `page_title_xxxx` のようにユニーク化されています。

</details>

---

## 3. リンクとナビゲーション

### Q11. `next/link` の `Link` コンポーネントは `<a>` タグと比べて何が優れていますか。

<details><summary>回答</summary>

クライアントサイドナビゲーションを行うため、ページ全体のリロードなしで遷移できます。加えて、ビューポートに入った `Link` を自動でプリフェッチするため、遷移が高速です。

```tsx
import Link from 'next/link'

<Link href="/about">About</Link>
```

</details>

### Q12. Client Component で動的にルート遷移するにはどの hook を使いますか。`router.push('/dashboard')` と `<Link href="/dashboard">` の使い分けを説明してください。

<details><summary>回答</summary>

`useRouter` を使います。

- `Link`: ユーザーがクリックして遷移する通常のナビゲーション
- `router.push`: フォーム送信後や条件分岐後など、プログラム的に遷移したいとき

```tsx
'use client'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()

  async function onSubmit() {
    // ログイン処理後
    router.push('/dashboard')
  }
}
```

</details>

### Q13. Server Component 内でリダイレクトしたい場合、どの関数を使いますか。`redirect()` と `permanentRedirect()` の違いも答えてください。

<details><summary>回答</summary>

`next/navigation` の `redirect()` を使います。

- `redirect()`: 307（一時リダイレクト）
- `permanentRedirect()`: 308（恒久リダイレクト、ブラウザがキャッシュする）

```tsx
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await getUser()
  if (!user) redirect('/login')
  return <Dashboard user={user} />
}
```

</details>

### Q14. `usePathname()` と `useSearchParams()` はそれぞれ何を返しますか。

<details><summary>回答</summary>

- `usePathname()`: 現在の URL パス（例: `/products/123`）
- `useSearchParams()`: クエリパラメータの `URLSearchParams` オブジェクト（例: `?q=foo` → `searchParams.get('q')` で `'foo'`）

どちらも Client Component でのみ使えます。

</details>

### Q15. `Link` コンポーネントのプリフェッチはどのタイミングで発生しますか。無効化する方法も答えてください。

<details><summary>回答</summary>

ビューポートに入ったタイミングで自動的にプリフェッチされます。無効化するには `prefetch={false}` を指定します。

```tsx
<Link href="/heavy-page" prefetch={false}>Heavy Page</Link>
```

</details>

### Q16. 演習: `/products` → `/products/[id]` → `/products/[id]/reviews` のパンくずリストを `Link` と `usePathname` で実装してください。

<details><summary>回答</summary>

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav>
      <Link href="/">Home</Link>
      {segments.map((seg, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')
        return (
          <span key={href}>
            {' / '}
            <Link href={href}>{seg}</Link>
          </span>
        )
      })}
    </nav>
  )
}
```

</details>

---

## 4. ルーティング

### Q17. `app/blog/[slug]/page.tsx` の `params` は Next.js 16 ではどの型になりますか。取り出し方も書いてください。

<details><summary>回答</summary>

`params` は `Promise<{ slug: string }>` です。`await` して取り出します。

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>{slug}</h1>
}
```

</details>

### Q18. `[slug]`、`[...slug]`、`[[...slug]]` の違いを説明してください。

<details><summary>回答</summary>

- `[slug]`: 単一セグメントを受け取る
- `[...slug]`: 1 個以上の複数セグメントを配列で受け取る
- `[[...slug]]`: 0 個以上の複数セグメントを配列で受け取る。省略も可能

例:

```text
app/docs/[slug]/page.tsx        -> /docs/intro
app/docs/[...slug]/page.tsx     -> /docs/a/b/c
app/docs/[[...slug]]/page.tsx   -> /docs, /docs/a, /docs/a/b
```

</details>

### Q19. Route Groups の `(marketing)` は URL にどう影響しますか。また `_components` のような private folder は何のために使いますか。

<details><summary>回答</summary>

`(marketing)` はコード整理用のグループで、URL には影響しません。`_components` のような private folder は、ルートセグメントとして扱わず、共通部品や補助コードを同じ場所に置くために使います。

例:

```text
app/
  (marketing)/
    pricing/
      page.tsx   -> /pricing
  _components/
    hero.tsx
```

</details>

### Q20. Parallel Routes の `@analytics` は何を表しますか。通常の `children` とどう違いますか。

<details><summary>回答</summary>

`@analytics` は名前付きスロットです。`children` とは別の並列領域としてレイアウトに差し込めます。複数の独立した UI 領域を同時に描画したいときに使います。

```tsx
// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics,
}: LayoutProps<'/dashboard'>) {
  return (
    <div>
      <main>{children}</main>
      <aside>{analytics}</aside>
    </div>
  )
}
```

</details>

### Q21. Intercepting Routes の `(.)`、`(..)`、`(...)` はどういうときに使いますか。

<details><summary>回答</summary>

現在のレイアウト文脈を保ったまま、別ルートを割り込ませて表示したいときに使います。典型例は一覧ページ上のモーダル詳細です。

- `(.)`: 同じ階層
- `(..)`: 1 階層上
- `(...)`: ルートから

例として、`/feed` 上で `/photo/123` をモーダル表示する構成が代表例です。

</details>

### Q22. `default.tsx` はどの場面で必要になりますか。

<details><summary>回答</summary>

Parallel Routes で、特定スロットに現在一致するルートがないときのフォールバック UI として使います。リロード時や直接アクセス時に、スロットをどう埋めるかを明示できます。

</details>

### Q23. 演習: `/docs`、`/docs/react`、`/docs/react/hooks` に対応する 1 つのページを作るには、どのようなフォルダ構成が考えられますか。

<details><summary>回答</summary>

`[[...slug]]` を使います。

```text
app/
  docs/
    [[...slug]]/
      page.tsx
```

例:

```tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  return <pre>{JSON.stringify(slug ?? [], null, 2)}</pre>
}
```

</details>

---

## 5. Server / Client Components

### Q24. App Router では、`page.tsx` と `layout.tsx` はデフォルトで Server Component と Client Component のどちらですか。

<details><summary>回答</summary>

デフォルトでは Server Component です。

</details>

### Q25. Client Component にするために必要なディレクティブは何ですか。どこに書きますか。

<details><summary>回答</summary>

`'use client'` です。ファイルの先頭に書きます。

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

</details>

### Q26. `useState`、`useEffect`、イベントハンドラ、`window.localStorage` はなぜ Server Component では使えませんか。

<details><summary>回答</summary>

これらはブラウザ上の状態管理や副作用、イベント処理、ブラウザ API に依存するためです。Server Component はサーバー実行が前提なので、Client Component に切り出す必要があります。

</details>

### Q27. Server Component から Client Component に `posts` を props で渡すのはなぜ一般的ですか。

<details><summary>回答</summary>

データ取得はサーバー側に寄せ、対話 UI だけクライアントに渡せるからです。これにより、クライアントバンドルを小さく保ちやすくなります。

```tsx
// Server Component
import { SearchBox } from './search-box'

export default async function Page() {
  const posts = await getPosts()
  return <SearchBox posts={posts} />
}
```

</details>

### Q28. 次のコードの問題点は何ですか。

```tsx
import { useState } from 'react'

export default function Page() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

<details><summary>回答</summary>

`'use client'` がないため、Server Component として扱われ、`useState` と `onClick` を使えません。Client Component にするか、対話部分を子コンポーネントへ分離する必要があります。

</details>

### Q29. `params` が Promise で渡される Client Component ページでは、どのように値を読む方法がありますか。

<details><summary>回答</summary>

React の `use()` を使えます。

```tsx
'use client'

import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  return <h1>{slug}</h1>
}
```

</details>

### Q30. 演習: 商品データ取得は Server Component、カートに追加ボタンだけ Client Component に分けてください。分離する理由も説明してください。

<details><summary>回答</summary>

理由は、データ取得と秘密情報アクセスはサーバーに留め、クリック処理やローカル状態だけをクライアントに閉じ込めるためです。

```tsx
// app/products/page.tsx
import AddToCartButton from './add-to-cart-button'

export default async function Page() {
  const product = { id: 'p1', name: 'Keyboard' }
  return (
    <div>
      <h1>{product.name}</h1>
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

```tsx
// app/products/add-to-cart-button.tsx
'use client'

import { useState } from 'react'

export default function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)
  return (
    <button onClick={() => setAdded(true)}>
      {added ? `${productId} added` : 'Add to cart'}
    </button>
  )
}
```

</details>

---

## 6. データフェッチ

### Q31. App Router では、データフェッチは主にどこで行うのが基本ですか。

<details><summary>回答</summary>

基本は Server Components です。`page.tsx` や `layout.tsx` を `async` 関数にして直接 `fetch` や ORM、DB クエリを実行できます。

</details>

### Q32. Next.js 16 では `fetch` はデフォルトでどのように扱われますか。

<details><summary>回答</summary>

デフォルトではキャッシュされません。必要な場合だけ `use cache` などの明示的な仕組みでキャッシュ方針を与えます。

</details>

### Q33. 同一リクエスト中に同じ `fetch` を複数回呼んだ場合の挙動を説明してください。

<details><summary>回答</summary>

同一リクエスト内ではリクエストメモ化が働き、同じ入力の `fetch` は重複して実行されず再利用されます。これは「永続キャッシュ」ではなく「そのレンダー処理中の重複排除」です。

</details>

### Q34. 次のコードのように Server Component から直接 DB 関数を呼べるのはなぜですか。

```tsx
export default async function Page() {
  const posts = await db.post.findMany()
  return <PostList posts={posts} />
}
```

<details><summary>回答</summary>

Server Component はサーバーで実行されるためです。クライアントに DB クレデンシャルや ORM 実装を送らずに、サーバー側で安全にデータ取得して結果だけを HTML/RSC Payload として返せます。

</details>

### Q35. `searchParams` を使って一覧をフィルタしたい場合、Server Component と Client Component のどちらで扱うのが自然ですか。

<details><summary>回答</summary>

検索条件に応じてサーバー側でデータを取得し直すなら Server Component の `searchParams` を使うのが自然です。クライアント内で既に取得済みの配列を絞り込むだけなら `useSearchParams` を使う選択肢もあります。

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const posts = await searchPosts(q)
  return <PostList posts={posts} />
}
```

</details>

### Q36. `loading.tsx` と `<Suspense>` はデータフェッチ時にどう使い分けますか。

<details><summary>回答</summary>

`loading.tsx` はルートセグメント全体のローディング UI、`<Suspense>` はページ内の一部分だけを個別にストリーミングしたいときに使います。

</details>

### Q37. 演習: `app/products/page.tsx` で商品一覧、`app/products/loading.tsx` でスケルトンを出してください。何を確認すべきですか。

<details><summary>回答</summary>

確認ポイントは、サーバーのデータ取得が遅いときに `loading.tsx` が先に表示され、その後に本体がストリーミング表示されることです。

```tsx
// app/products/loading.tsx
export default function Loading() {
  return <p>Loading products...</p>
}
```

```tsx
// app/products/page.tsx
async function getProducts() {
  await new Promise((r) => setTimeout(r, 2000))
  return [{ id: 1, name: 'Book' }]
}

export default async function Page() {
  const products = await getProducts()
  return <pre>{JSON.stringify(products, null, 2)}</pre>
}
```

</details>

---

## 7. Streaming と Suspense

### Q38. RSC Payload（React Server Component Payload）とは何ですか。何が含まれていますか。

<details><summary>回答</summary>

Server Components のレンダリング結果をバイナリ形式で表現したデータです。以下が含まれます:

- Server Components のレンダリング結果
- Client Components がレンダリングされる場所のプレースホルダーと JS ファイルへの参照
- Server Component から Client Component に渡される props

</details>

### Q39. Hydration（ハイドレーション）とは何ですか。なぜ必要ですか。

<details><summary>回答</summary>

サーバーから送られた静的 HTML にイベントハンドラをアタッチし、インタラクティブにする React のプロセスです。HTML だけではクリックや入力に反応できないため、JS で「水分補給」して生きた UI にする必要があります。

</details>

### Q40. Selective Hydration とは何ですか。Suspense とどう関係しますか。

<details><summary>回答</summary>

ページ全体を一度に Hydration するのではなく、`<Suspense>` 境界ごとに個別に Hydration するしくみです。ユーザーが操作した部分を優先的に Hydration でき、インタラクティブになるまでの時間を短縮します。

</details>

### Q41. ストリーミングが TTFB（Time To First Byte）と FCP（First Contentful Paint）に与える影響を説明してください。

<details><summary>回答</summary>

ストリーミングにより、全データ取得完了を待たずに HTML の先頭部分を送信開始できるため、TTFB が改善されます。見えている部分から先に表示されるため FCP も速くなります。遅いデータは後から Suspense boundary 内にストリーム配信されます。

</details>

### Q42. 演習: 1 つのページに `<Suspense>` を 3 つ配置し、それぞれ異なる遅延のデータを取得して、段階的に表示されることを確認してください。

<details><summary>回答</summary>

```tsx
import { Suspense } from 'react'

async function SlowData({ delay, label }: { delay: number; label: string }) {
  await new Promise((r) => setTimeout(r, delay))
  return <p>{label}: loaded after {delay}ms</p>
}

export default function Page() {
  return (
    <div>
      <h1>Streaming Demo</h1>
      <Suspense fallback={<p>Loading fast...</p>}>
        <SlowData delay={500} label="Fast" />
      </Suspense>
      <Suspense fallback={<p>Loading medium...</p>}>
        <SlowData delay={2000} label="Medium" />
      </Suspense>
      <Suspense fallback={<p>Loading slow...</p>}>
        <SlowData delay={5000} label="Slow" />
      </Suspense>
    </div>
  )
}
```

500ms、2秒、5秒の順に段階的にコンテンツが表示されることを確認します。

</details>

---

## 8. Server Actions

### Q43. Server Actions はどのディレクティブを使って定義しますか。

<details><summary>回答</summary>

`'use server'` を使います。

</details>

### Q44. `<form action={createPost}>` の `action` に Server Action を渡せる利点は何ですか。

<details><summary>回答</summary>

クライアント側で独自の API 呼び出しコードを手書きしなくても、フォーム送信とサーバー処理を直接結びつけられます。フォーム中心の更新処理をシンプルに書けます。

```tsx
async function createPost(formData: FormData) {
  'use server'
  const title = String(formData.get('title') ?? '')
  await db.post.create({ data: { title } })
}

export default function Page() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Save</button>
    </form>
  )
}
```

</details>

### Q45. `useActionState` は何のために使いますか。

<details><summary>回答</summary>

Server Action の戻り値を使って、送信結果の状態やバリデーションメッセージを UI に反映するために使います。

</details>

### Q46. Expected errors を扱うとき、Server Action では `throw` より何を返す設計が推奨されますか。

<details><summary>回答</summary>

想定内の失敗は `throw` ではなく、`{ message: '...' }` のような戻り値として返す設計が推奨されます。UI がその結果を安全に描画しやすくなります。

</details>

### Q47. 次の例で `useActionState` と相性が良い戻り値の形を考えてください。

```tsx
type FormState = {
  ok: boolean
  message: string
}
```

<details><summary>回答</summary>

例えば以下のように、成功・失敗の両方で同じ形を返すと扱いやすいです。

```tsx
'use server'

export async function createPost(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = String(formData.get('title') ?? '')

  if (!title) {
    return { ok: false, message: 'タイトルは必須です' }
  }

  await db.post.create({ data: { title } })
  return { ok: true, message: '作成しました' }
}
```

</details>

### Q48. 演習: タイトル未入力時にエラー文字列を表示し、成功時に一覧ページのキャッシュを無効化する投稿フォームを作ってください。使う API を列挙してください。

<details><summary>回答</summary>

使うもの:

- `'use server'`
- `<form action={...}>`
- `useActionState`
- `revalidatePath('/posts')`

</details>

---

### Q49. Server Action と Route Handler（API エンドポイント）の違いは何ですか。それぞれどのような場面で使い分けますか。

<details><summary>回答</summary>

- **Server Action**: フォーム送信やデータ変更など、UI からの mutation に使う。`<form action={...}>` で直接バインドでき、クライアント JS を書かずにサーバー処理を呼べる
- **Route Handler**: 外部サービスからの webhook 受信、サードパーティとの連携 API、モバイルアプリ向け REST エンドポイントなど、UI に紐づかない HTTP エンドポイントに使う

Server Action は「UI の延長としてのサーバー処理」、Route Handler は「独立した HTTP API」と考えるのがわかりやすいです。

</details>

### Q50. Server Action を使うメリットを Route Handler で同じことをする場合と比較して 3 つ挙げてください。

<details><summary>回答</summary>

1. **コード量の削減**: fetch + API ルート + ハンドラの3層が不要。Action を form に渡すだけ
2. **型安全性**: Server Action は TypeScript で引数・戻り値の型が一貫する。REST API だとリクエスト/レスポンスの型が分断されやすい
3. **Progressive Enhancement**: JS が無効でも HTML フォーム送信で動作する。API + fetch の場合は JS 必須

```tsx
// Server Action: 3行で完結
async function createPost(formData: FormData) {
  'use server'
  await db.post.create({ data: { title: String(formData.get('title')) } })
  revalidatePath('/posts')
}

// Route Handler 相当: fetch + API ルート + ハンドラの3層が必要
// app/api/posts/route.ts → POST handler
// client → fetch('/api/posts', { method: 'POST', body: ... })
```

</details>

### Q51. Server Action が向かないケースを 2 つ挙げてください。

<details><summary>回答</summary>

1. **外部システムからの呼び出し**: webhook、モバイルアプリ、サードパーティ連携など、ブラウザ以外からのリクエストには Route Handler が必要
2. **GET リクエスト**: Server Action は POST のみ。データ取得用のエンドポイントには Route Handler を使う

Server Action はあくまで「UI → サーバー」の mutation 用で、汎用的な HTTP API ではありません。

</details>

### Q52. Server Action で `redirect()` を呼ぶとき、`try/catch` の中で呼んではいけないのはなぜですか。

<details><summary>回答</summary>

`redirect()` は内部的に特殊な例外を throw して Next.js のルーティングに制御を渡します。`try/catch` でこれを捕まえてしまうと、リダイレクトが実行されません。

```tsx
// NG
async function createPost(formData: FormData) {
  'use server'
  try {
    await db.post.create(...)
    redirect('/posts') // catch に捕まってリダイレクトされない
  } catch (e) {
    return { error: 'failed' }
  }
}

// OK
async function createPost(formData: FormData) {
  'use server'
  const result = await db.post.create(...)
  if (!result) return { error: 'failed' }
  redirect('/posts')
}
```

</details>

### Q53. Server Action の戻り値を使ってフォームの状態管理をする `useActionState` の基本的な使い方を書いてください。

<details><summary>回答</summary>

```tsx
// app/actions.ts
'use server'
type State = { message: string } | null

export async function createPost(prevState: State, formData: FormData): Promise<State> {
  const title = String(formData.get('title') ?? '')
  if (!title) return { message: 'タイトルは必須です' }
  await db.post.create({ data: { title } })
  revalidatePath('/posts')
  return { message: '作成しました' }
}
```

```tsx
// app/form.tsx
'use client'
import { useActionState } from 'react'
import { createPost } from './actions'

export function PostForm() {
  const [state, action, pending] = useActionState(createPost, null)
  return (
    <form action={action}>
      <input name="title" />
      <button disabled={pending}>{pending ? '送信中...' : '投稿'}</button>
      {state?.message && <p>{state.message}</p>}
    </form>
  )
}
```

3つの値が返る: `state`（Action の戻り値）、`action`（form に渡す関数）、`pending`（送信中フラグ）

</details>

### Q54. 演習: 以下の要件で Server Action を使った削除機能を実装してください。Route Handler で実装する場合との違いも比較してください。
- 記事 ID を受け取って削除
- 削除後に一覧ページへリダイレクト
- 認証チェック付き

<details><summary>回答</summary>

**Server Action 版:**

```tsx
'use server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deletePost(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await db.post.delete({ where: { id } })
  revalidatePath('/posts')
  redirect('/posts')
}
```

```tsx
// 呼び出し側
<form action={deletePost.bind(null, post.id)}>
  <button type="submit">削除</button>
</form>
```

**Route Handler 版（比較用）:**

```ts
// app/api/posts/[id]/route.ts
export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/posts/[id]'>) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  await db.post.delete({ where: { id } })
  return Response.json({ ok: true })
}
```

```tsx
// クライアント側で fetch + リダイレクト
'use client'
async function handleDelete(id: string) {
  await fetch(`/api/posts/${id}`, { method: 'DELETE' })
  router.push('/posts')
}
```

Server Action 版は fetch・ルーティング・状態管理のコードが不要で、Progressive Enhancement も効きます。

</details>

---

## 9. フォームとバリデーション

### Q55. `useFormStatus` は何を返しますか。どのような場面で使いますか。

<details><summary>回答</summary>

`{ pending, data, method, action }` を返します。主に `pending` を使って、フォーム送信中にボタンを無効化したりローディング表示を出すために使います。

注意: `useFormStatus` は `<form>` の子コンポーネント内でのみ動作します。

</details>

### Q56. Server Action を `<form action={...}>` に渡した場合、JavaScript が無効でもフォームは動作しますか。この性質を何と呼びますか。

<details><summary>回答</summary>

はい、動作します。これを **Progressive Enhancement**（プログレッシブ・エンハンスメント）と呼びます。JS が無効でも HTML のフォーム送信として POST が飛び、JS が有効なら React が SPA 的に処理します。

</details>

### Q57. `useOptimistic` は何をする hook ですか。どのような UX 改善に使えますか。

<details><summary>回答</summary>

サーバー応答を待たずに UI を先行的に更新する hook です。いいねボタンやコメント投稿など、即座にフィードバックしたい場面で使います。サーバー応答後に実際のデータで置き換わります。

```tsx
'use client'
import { useOptimistic } from 'react'

function LikeButton({ likes, onLike }) {
  const [optimisticLikes, addOptimistic] = useOptimistic(
    likes,
    (current, _) => current + 1
  )

  return (
    <form action={async () => {
      addOptimistic(null)
      await onLike()
    }}>
      <button>{optimisticLikes} likes</button>
    </form>
  )
}
```

</details>

### Q58. フォームバリデーションをクライアントだけでなくサーバー側でも行うべき理由を説明してください。

<details><summary>回答</summary>

クライアントバリデーションは JS 無効や直接 POST で迂回できるためです。セキュリティの境界はサーバー側に置く必要があります。クライアントバリデーションは UX 向上用、サーバーバリデーションはデータ保護用です。

</details>

### Q59. 次のコードで `pending` を使って送信中にボタンを無効化する方法を書いてください。

```tsx
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  // ここを実装
}
```

<details><summary>回答</summary>

```tsx
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? '送信中...' : '送信'}
    </button>
  )
}
```

</details>

### Q60. 演習: いいねボタンを `useOptimistic` で実装し、サーバー応答前に UI を更新してください。

<details><summary>回答</summary>

Server Action でいいね数を更新し、`useOptimistic` で即座に +1 を表示します。

```tsx
// app/actions.ts
'use server'
export async function addLike(postId: string) {
  await db.post.update({ where: { id: postId }, data: { likes: { increment: 1 } } })
  revalidatePath('/posts')
}
```

```tsx
// app/posts/like-button.tsx
'use client'
import { useOptimistic } from 'react'
import { addLike } from '@/app/actions'

export function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [optimisticLikes, setOptimistic] = useOptimistic(initialLikes, (cur) => cur + 1)

  return (
    <form action={async () => {
      setOptimistic(null)
      await addLike(postId)
    }}>
      <button type="submit">{optimisticLikes} likes</button>
    </form>
  )
}
```

</details>

---

## 10. Route Handlers

### Q61. Route Handler はどのファイル名で定義しますか。何の API を使って実装しますか。

<details><summary>回答</summary>

`route.ts` です。Web の Request / Response API を使って実装します。

```ts
export async function GET() {
  return Response.json({ ok: true })
}
```

</details>

### Q62. `page.tsx` と `route.ts` を同じセグメントに置けないのはなぜですか。

<details><summary>回答</summary>

同じルートを `page` と `route` のどちらが担当するか衝突するためです。1 つのセグメントでは、`page` か `route` のどちらかがその HTTP 動作を引き受けます。

```text
app/page.tsx + app/route.ts      -> conflict
app/page.tsx + app/api/route.ts  -> valid
```

</details>

### Q63. Route Handlers でサポートされる代表的な HTTP メソッドを挙げてください。

<details><summary>回答</summary>

`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD`、`OPTIONS` です。

</details>

### Q64. 動的セグメントの Route Handler で `id` を安全に取り出すにはどう書けますか。

<details><summary>回答</summary>

`context.params` も Promise なので `await` して取り出します。

```ts
import type { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/users/[id]'>
) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

</details>

### Q65. Page と比べて、Route Handler が「レイアウトやクライアント遷移に参加しない」とはどういう意味ですか。

<details><summary>回答</summary>

Route Handler は UI を返すページ部品ではなく、HTTP エンドポイントです。`layout.tsx` の配下として描画されず、ブラウザのページ遷移 UI として扱われません。

</details>

### Q66. 演習: `app/api/health/route.ts` を作って `{"status":"ok"}` を返してください。ブラウザまたは `curl` で何を確認しますか。

<details><summary>回答</summary>

ステータスコードと JSON 本文を確認します。

```ts
export async function GET() {
  return Response.json({ status: 'ok' })
}
```

確認:

```bash
curl http://localhost:3000/api/health
```

</details>

---

## 11. キャッシング

### Q67. Next.js 16 で `use cache` を使う前提として、`next.config.ts` にはどの設定が必要ですか。

<details><summary>回答</summary>

`cacheComponents: true` が必要です。

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

</details>

### Q68. `use cache` は何をするディレクティブですか。

<details><summary>回答</summary>

Server Component やサーバー関数の結果をキャッシュ対象として扱うためのディレクティブです。Next.js 16 では、キャッシュしたい箇所を明示して設計するのが基本です。

</details>

### Q69. `cacheLife('hours')` のような API は何を表しますか。

<details><summary>回答</summary>

キャッシュの寿命を表します。どれくらいの時間、その結果を再利用してよいかを指定します。

```tsx
import { cacheLife } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  return db.product.findMany()
}
```

</details>

### Q70. 「リクエストメモ化」と「永続的なキャッシュ」の違いを説明してください。

<details><summary>回答</summary>

リクエストメモ化は同一レンダー中の重複排除です。一方、永続的なキャッシュはリクエストをまたいで再利用されます。`fetch` の重複排除だけで、長期キャッシュされているとは限りません。

</details>

### Q71. `revalidatePath('/products')` と `revalidateTag('products')` はどう使い分けますか。

<details><summary>回答</summary>

- `revalidatePath`: 特定のページやレイアウトのパス単位で再検証したいとき
- `revalidateTag`: 同じデータソースを複数ページから参照しており、タグ単位でまとめて無効化したいとき

</details>

### Q72. 演習: 商品作成後に一覧を最新化したいです。`/products` だけ再取得すればよいケースと、商品データを参照する複数ページをまとめて更新したいケースで、どちらを使いますか。

<details><summary>回答</summary>

`/products` のみを更新するなら `revalidatePath('/products')`、商品タグを共有する複数のページを更新するなら `revalidateTag('products')` を使います。

</details>

---

## 12. エラーハンドリング

### Q73. `error.tsx` は何のためのファイルですか。

<details><summary>回答</summary>

そのセグメント以下で発生した予期しない例外を受け止める Error Boundary 用のファイルです。

</details>

### Q74. `global-error.tsx` はどのような場面で使いますか。

<details><summary>回答</summary>

ルート全体に近いレベルで、より広範囲の致命的な描画エラーを処理したいときに使います。

</details>

### Q75. `not-found.tsx` はいつ表示されますか。

<details><summary>回答</summary>

`notFound()` を呼んだときや、該当リソースなしとして 404 相当の UI を出したいときに表示されます。

```tsx
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  return <article>{post.title}</article>
}
```

</details>

### Q76. 想定内のバリデーションエラーを Server Action で扱うとき、`try/catch` より戻り値を使うのがよいのはなぜですか。

<details><summary>回答</summary>

想定内の失敗は例外ではなく、状態として UI に反映すべきだからです。戻り値ならフォームエラーや入力ミスを自然に表現でき、エラー境界に飛ばさずに済みます。

</details>

### Q77. 演習: `app/posts/[slug]/error.tsx` と `app/posts/[slug]/not-found.tsx` を作り、例外時と未存在時で別 UI が出ることを確認してください。どうテストしますか。

<details><summary>回答</summary>

例えば以下で確認します。

- 未存在 slug のとき `notFound()` を呼んで 404 UI を出す
- 特定 slug のとき `throw new Error('boom')` して `error.tsx` を出す

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={() => reset()}>retry</button>
    </div>
  )
}
```

</details>

---

## 13. 環境変数

### Q78. `NEXT_PUBLIC_` プレフィックスがついた環境変数とそうでないものの違いは何ですか。

<details><summary>回答</summary>

- `NEXT_PUBLIC_` 付き: クライアントバンドルに含まれ、ブラウザから参照可能
- プレフィックスなし: サーバー側のみで参照可能、クライアントには含まれない

</details>

### Q79. `.env`、`.env.local`、`.env.production` の読み込み優先順位を説明してください。

<details><summary>回答</summary>

優先度が高い順に:
1. `.env.$(NODE_ENV).local`（例: `.env.production.local`）
2. `.env.local`（`test` 環境では読み込まれない）
3. `.env.$(NODE_ENV)`（例: `.env.production`）
4. `.env`

後から読み込まれたものが上書きするのではなく、先に見つかった値が優先されます。

</details>

### Q80. Server Component でのみ使いたい API キーは、なぜ `NEXT_PUBLIC_` をつけてはいけないですか。

<details><summary>回答</summary>

`NEXT_PUBLIC_` をつけるとクライアントの JS バンドルに含まれ、ブラウザの devtools やソースマップから誰でも読めてしまうためです。API キーや秘密情報はプレフィックスなしにして、Server Component や Route Handler からのみ参照します。

</details>

### Q81. `process.env.DATABASE_URL` を Client Component で参照するとどうなりますか。

<details><summary>回答</summary>

`undefined` になります。`NEXT_PUBLIC_` プレフィックスがない環境変数はクライアントバンドルにインライン展開されないため、Client Component からは見えません。

</details>

### Q82. 演習: `.env.local` に `API_SECRET=xxx` を定義し、Server Component でのみ参照できることを確認してください。

<details><summary>回答</summary>

```bash
# .env.local
API_SECRET=my-secret-key
```

```tsx
// app/page.tsx (Server Component)
export default function Page() {
  const secret = process.env.API_SECRET
  return <p>Secret exists: {secret ? 'yes' : 'no'}</p>
}
```

```tsx
// app/client-test.tsx (Client Component)
'use client'
export function ClientTest() {
  const secret = process.env.API_SECRET // undefined
  return <p>Secret in client: {secret ?? 'undefined'}</p>
}
```

Server Component では `yes`、Client Component では `undefined` になることを確認します。

</details>

---

## 14. 最適化

### Q83. `next/image` を使う利点を 2 つ挙げてください。

<details><summary>回答</summary>

自動最適化とレスポンシブ対応です。画像サイズ調整、遅延読み込み、適切な配信形式の活用などで表示性能を改善しやすくなります。

</details>

### Q84. `next/font` を使うと何が改善されますか。

<details><summary>回答</summary>

フォント最適化をフレームワーク側で扱えます。不要な外部リクエストを減らしやすく、レイアウトシフトの抑制にも役立ちます。

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
```

</details>

### Q85. Metadata は `export const metadata` と `generateMetadata` をどう使い分けますか。

<details><summary>回答</summary>

固定値なら `export const metadata`、動的パラメータや取得データに応じて変えたいなら `generateMetadata` を使います。

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return {
    title: `Post: ${slug}`,
  }
}
```

</details>

### Q86. `favicon.ico`、`opengraph-image.tsx`、`robots.txt` などのファイル規約は何のためにありますか。

<details><summary>回答</summary>

メタデータ関連ファイルを、ルーティング規約の一部として自動配信・自動反映するためです。head の設定や画像メタデータを手作業で配線する量を減らせます。

</details>

### Q87. `loading.tsx` や `<Suspense>` を使ったストリーミングは、体感性能にどう効きますか。

<details><summary>回答</summary>

全データ取得完了まで画面を止めず、見せられる部分から先に返せます。TTFB 後に早く UI を表示できるため、待たされている感覚を減らせます。

</details>

### Q88. 演習: 商品詳細ページに `generateMetadata` と `opengraph-image.tsx` を追加してください。何を確認するとよいですか。

<details><summary>回答</summary>

確認ポイント:

- タブタイトルが slug に応じて変わる
- OGP 画像 URL が生成される
- ソースや devtools で metadata 反映を確認できる

</details>

---

## 15. セキュリティとデータ保護

### Q89. `server-only` パッケージは何をするものですか。どのように使いますか。

<details><summary>回答</summary>

サーバー専用のコードが誤って Client Component にインポートされた場合にビルドエラーを出すパッケージです。

```tsx
import 'server-only'

export async function getSecretData() {
  return db.query('SELECT * FROM secrets')
}
```

このファイルを Client Component から import するとビルドが失敗します。

</details>

### Q90. Server Actions は UI 経由以外でも直接 POST リクエストで呼び出せます。なぜ認証チェックが必須ですか。

<details><summary>回答</summary>

Server Actions は内部的に POST エンドポイントとして公開されるため、`curl` や外部スクリプトから直接呼び出せます。UI 側で認証済みであっても、Action 内で認証・認可を検証しないと、未認証リクエストを受け入れてしまいます。

```tsx
'use server'
export async function deletePost(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  // 削除処理
}
```

</details>

### Q91. `NEXT_PUBLIC_` をつけない環境変数がクライアントバンドルに含まれないのはなぜですか。

<details><summary>回答</summary>

Next.js のビルドプロセスが、`NEXT_PUBLIC_` プレフィックス付きの環境変数のみをクライアント JS にインライン展開するためです。プレフィックスがなければ、`process.env.X` はサーバー側でのみ解決され、クライアントバンドルには `undefined` として残ります。

</details>

### Q92. `taint` API（`experimental_taintObjectReference`）は何を防ぐためのものですか。

<details><summary>回答</summary>

機密データ（ユーザートークン、APIキー等）が Server Component から Client Component に props として誤って渡されることを防ぎます。taint でマークされたオブジェクトや値が Client Component に渡されるとエラーになります。

</details>

### Q93. 演習: `server-only` を import して、Client Component からその関数を呼ぼうとするとどうなるか確認してください。

<details><summary>回答</summary>

```bash
pnpm add server-only
```

```tsx
// app/lib/secret.ts
import 'server-only'

export function getApiKey() {
  return process.env.API_SECRET
}
```

```tsx
// app/client.tsx
'use client'
import { getApiKey } from './lib/secret' // ビルドエラー！

export function Client() {
  return <p>{getApiKey()}</p>
}
```

ビルド時に `server-only` モジュールのエラーが出ることを確認します。

</details>

---

## 16. Turbopack

### Q94. Turbopack とは何ですか。webpack と比べた主な違いを説明してください。

<details><summary>回答</summary>

Rust 製のインクリメンタルバンドラーです。webpack と比べて:

- Rust で書かれており、HMR やビルドが高速
- インクリメンタルコンピューテーションにより、変更があった部分だけ再処理
- Next.js 16 では dev サーバーのデフォルトバンドラー

</details>

### Q95. Next.js 16 の `create-next-app --yes` で dev サーバーは何で動きますか。

<details><summary>回答</summary>

Turbopack です。`--yes` のデフォルト設定に Turbopack が含まれています。

</details>

### Q96. Turbopack が対応していない webpack プラグインがある場合、どう対処しますか。

<details><summary>回答</summary>

dev 時に `--no-turbopack` フラグで webpack に切り替えるか、Turbopack 互換の代替手段を探します。本番ビルド（`next build`）は webpack を使うため、production には影響しません。

</details>

### Q97. 演習: `pnpm dev` 実行時にターミナルに Turbopack の表示が出ることを確認してください。

<details><summary>回答</summary>

```bash
pnpm dev
```

ターミナルに `▲ Next.js ... (Turbopack)` のような表示が出ます。`--no-turbopack` をつけると webpack に切り替わることも確認してみてください。

</details>

---

## 17. 国際化と高度なルーティング

### Q98. App Router で i18n を実現する基本パターンとして `[locale]` セグメントを使う方法を説明してください。

<details><summary>回答</summary>

```text
app/
  [locale]/
    layout.tsx
    page.tsx
    about/
      page.tsx
```

`/ja`, `/en` のように先頭セグメントでロケールを受け取り、layout や page 内で辞書データを切り替えます。

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  return <h1>{dict.welcome}</h1>
}
```

</details>

### Q99. `generateStaticParams` は何のために使いますか。使用例を書いてください。

<details><summary>回答</summary>

ビルド時に動的ルートのパラメータを列挙し、静的に生成するために使います。

```tsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

これにより `/blog/post-1`, `/blog/post-2` 等がビルド時に生成されます。

</details>

### Q100. proxy（middleware）でロケールを振り分けるパターンを説明してください。

<details><summary>回答</summary>

`Accept-Language` ヘッダーや cookie を見て、適切なロケールパスにリダイレクトします。

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const locale = request.headers.get('accept-language')?.startsWith('ja') ? 'ja' : 'en'
  if (!request.nextUrl.pathname.startsWith('/ja') && !request.nextUrl.pathname.startsWith('/en')) {
    return NextResponse.redirect(new URL(`/${locale}${request.nextUrl.pathname}`, request.url))
  }
}
```

</details>

### Q101. `generateStaticParams` を使わずに動的ルートをビルドするとどうなりますか。

<details><summary>回答</summary>

ビルド時には静的生成されず、リクエスト時にサーバーサイドで動的にレンダリングされます。パフォーマンスやキャッシュの観点で、よくアクセスされるパスは事前生成しておくのが望ましいです。

</details>

### Q102. 演習: `/ja/about` と `/en/about` で言語切り替えできるルーティングを構築してください。

<details><summary>回答</summary>

```text
app/
  [locale]/
    layout.tsx
    page.tsx
    about/
      page.tsx
```

```tsx
// app/[locale]/about/page.tsx
const dict = {
  ja: { title: 'このサイトについて' },
  en: { title: 'About' },
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = dict[locale as keyof typeof dict] ?? dict.en
  return <h1>{t.title}</h1>
}

export function generateStaticParams() {
  return [{ locale: 'ja' }, { locale: 'en' }]
}
```

</details>

---

## 18. 設定・デプロイ

### Q103. Next.js 16 では設定ファイルとして何を使うのが基本ですか。

<details><summary>回答</summary>

`next.config.ts` です。TypeScript で設定を書けます。

</details>

### Q104. Next.js 16 における `proxy.ts` は何ですか。`middleware.ts` との関係も答えてください。

<details><summary>回答</summary>

`proxy.ts` は、リクエスト完了前に実行されるクロスカッティングなサーバー処理を書くためのファイルです。Next.js 16 では Middleware は Proxy という名称になりました。用途はヘッダー操作、リダイレクト、リライト、簡単な認証分岐などです。

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (!request.cookies.get('session')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

</details>

### Q105. `proxy.ts` を重いデータフェッチや本格的な認可処理の中心にすべきでないのはなぜですか。

<details><summary>回答</summary>

Proxy はリクエスト前段で軽量に分岐する用途に向いているためです。重い処理や複雑なセッション管理を集中させると、性能・保守性の両面で不利になります。

</details>

### Q106. デプロイ前に最低限確認したいこととして、このプロジェクトの運用ルール上は何を実行すべきですか。

<details><summary>回答</summary>

`vp install`、`vp check`、`vp test` です。このリポジトリでは package manager や各ツールを直接叩かず、Vite+ の `vp` 経由で実行するのが前提です。

```bash
vp install
vp check
vp test
```

</details>

### Q107. `cacheComponents: true` を有効にしたプロジェクトで、キャッシュ戦略を決めずに実装を進めると何が起きやすいですか。

<details><summary>回答</summary>

どこが毎回再取得され、どこが再利用されるかの意図が曖昧になります。Next.js 16 では「必要なところだけ明示的にキャッシュする」設計が重要です。

</details>

### Q108. 演習: `next.config.ts` に `cacheComponents: true` を追加し、`proxy.ts` で `/admin` だけを保護し、`vp check` まで実行してください。確認観点を 3 つ挙げてください。

<details><summary>回答</summary>

確認観点:

- `/admin` へ未ログインでアクセスしたときにリダイレクトされるか
- それ以外のルートに Proxy が過剰適用されていないか
- `vp check` で型・lint・format の問題がないか

</details>

---

## 19. テストとデバッグ

### Q109. Next.js アプリのユニットテストで、Server Component をテストする際の課題は何ですか。

<details><summary>回答</summary>

Server Components は async でサーバー上で実行されるため、通常の React Testing Library では直接レンダリングできません。関数として直接呼び出してスナップショットを取るか、E2E テストで検証するアプローチが必要です。

</details>

### Q110. Route Handler の単体テストはどのように書けますか。

<details><summary>回答</summary>

Route Handler は Web Request/Response API を使った普通の関数なので、直接 import して呼び出せます。

```ts
import { GET } from '@/app/api/health/route'

test('GET /api/health', async () => {
  const response = await GET()
  const data = await response.json()
  expect(data).toEqual({ status: 'ok' })
})
```

</details>

### Q111. Next.js の `next.config.ts` で `logging` を有効にすると何がわかりますか。

<details><summary>回答</summary>

Server Components 内の `fetch` リクエストの詳細（URL、キャッシュヒット/ミス、所要時間等）がターミナルに表示されます。データフェッチのデバッグに有用です。

```ts
const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

</details>

### Q112. Playwright や Cypress を使った E2E テストで、Next.js アプリをテストする際の基本的な流れを説明してください。

<details><summary>回答</summary>

1. `next build` + `next start` で本番ビルドを起動（または `next dev`）
2. テストランナーがブラウザを起動しページにアクセス
3. 要素の表示確認、クリック、フォーム入力、ナビゲーション等を検証
4. CI では `webServer` 設定で自動起動

```ts
// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'pnpm build && pnpm start',
    port: 3000,
  },
})
```

</details>

### Q113. 演習: `app/api/health/route.ts` に対するユニットテストを書いてください。

<details><summary>回答</summary>

```ts
// __tests__/api/health.test.ts
import { GET } from '@/app/api/health/route'

describe('/api/health', () => {
  it('returns ok status', async () => {
    const response = await GET()
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual({ status: 'ok' })
  })
})
```

</details>

---

## 20. 総合演習

### Q114. ブログアプリを設計するとき、`layout.tsx`、`page.tsx`、`loading.tsx`、`error.tsx` をどのセグメントに配置しますか。ディレクトリ構成を書いてください。

<details><summary>回答</summary>

```text
app/
  layout.tsx          # Root Layout（ヘッダー、フッター）
  page.tsx            # トップページ
  blog/
    layout.tsx        # ブログ共通レイアウト（サイドバー等）
    page.tsx          # 記事一覧
    loading.tsx       # 一覧のスケルトン
    error.tsx         # 一覧のエラー境界
    [slug]/
      page.tsx        # 記事詳細
      loading.tsx     # 詳細のスケルトン
      error.tsx       # 詳細のエラー境界
      not-found.tsx   # 記事が見つからない場合
```

</details>

### Q115. CRUD 操作を Server Action + `revalidatePath` で実装するパターンを説明してください。

<details><summary>回答</summary>

```tsx
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  await db.post.create({ data: { title: String(formData.get('title')) } })
  revalidatePath('/blog')
}

export async function updatePost(id: string, formData: FormData) {
  await db.post.update({ where: { id }, data: { title: String(formData.get('title')) } })
  revalidatePath(`/blog/${id}`)
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })
  revalidatePath('/blog')
  redirect('/blog')
}
```

各操作後に `revalidatePath` で関連ページのキャッシュを無効化し、最新データを表示します。

</details>

### Q116. 認証フローを proxy + Server Component + Client Component で設計する場合、それぞれの責務は何ですか。

<details><summary>回答</summary>

- **proxy（middleware）**: リクエスト前段でセッション cookie の有無を確認し、未認証なら `/login` にリダイレクト
- **Server Component**: セッションからユーザー情報を取得し、認可判定を行い、データをフェッチ
- **Client Component**: ログインフォームの入力 UI、ログアウトボタン等のインタラクション

重い認証ロジックや DB クエリは Server Component に寄せ、proxy は軽量な振り分けに留めます。

</details>

### Q117. Next.js アプリのパフォーマンス最適化チェックリストを 5 項目挙げてください。

<details><summary>回答</summary>

1. `next/image` で画像を最適化（遅延読み込み、サイズ最適化）
2. `next/font` でフォント最適化（レイアウトシフト防止）
3. `<Suspense>` でストリーミングし、遅いデータのブロックを回避
4. Server Components をデフォルトにし、Client Component は最小限に
5. `use cache` + `cacheLife` で適切なキャッシュ戦略を設定

</details>

### Q118. あるコンポーネントを Server Component にするか Client Component にするか迷ったとき、判断基準は何ですか。

<details><summary>回答</summary>

- `useState`、`useEffect`、イベントハンドラ、ブラウザ API が必要 → **Client Component**
- データフェッチ、DB アクセス、秘密情報の参照が必要 → **Server Component**
- どちらにも該当しない → **Server Component**（デフォルト、バンドルサイズが小さい）

迷ったら Server Component にして、インタラクションが必要な部分だけ子コンポーネントとして Client Component に分離します。

</details>

### Q119. 演習: 以下の要件でミニブログを構築するステップを書いてください。
- 記事一覧（Server Component）
- 記事詳細（動的ルート、`generateMetadata`）
- 記事作成フォーム（Server Action、`useActionState`）
- エラー・ローディング UI

<details><summary>回答</summary>

1. `app/blog/page.tsx` で記事一覧を Server Component として作成
2. `app/blog/[slug]/page.tsx` で記事詳細を作成、`generateMetadata` でタイトル動的生成
3. `app/blog/new/page.tsx` で作成フォーム UI（Client Component）
4. `app/actions.ts` に `createPost` Server Action を定義
5. フォームから `useActionState` で Action を呼び出し、バリデーションエラーを表示
6. `app/blog/loading.tsx` でスケルトン UI
7. `app/blog/error.tsx` でエラー境界
8. `app/blog/[slug]/not-found.tsx` で 404 UI
9. Action 内で `revalidatePath('/blog')` を呼んで一覧を最新化

</details>


---

## 21. 追加確認用ミニ課題

### Q120. `layout.tsx` は state を保持し再レンダーされにくい一方で、`template.tsx` は毎回作り直されます。フォーム入力を保持したい共通サイドバーはどちらに置くべきですか。

<details><summary>回答</summary>

`layout.tsx` です。状態維持が目的だからです。

</details>

### Q121. `app/users/[id]/page.tsx` で `const { id } = params` と書くと Next.js 16 では何が問題になりますか。

<details><summary>回答</summary>

`params` は Promise なので、そのまま分割代入できません。`const { id } = await params` が必要です。

</details>

### Q122. App Router で「一覧は Server Component、絞り込み UI は Client Component、更新は Server Action、外部連携 API は Route Handler」という分担はなぜ筋が良いですか。

<details><summary>回答</summary>

責務分離が明確だからです。

- データ取得はサーバーで安全かつ軽量
- UI の対話だけクライアントに限定
- 更新処理はフォーム中心に簡潔
- 外部公開エンドポイントは HTTP 境界として分離

</details>

---
