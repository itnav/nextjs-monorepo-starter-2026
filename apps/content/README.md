# content

Next.js アプリケーション。

## ディレクトリ構造

```
src/
├── app/
│   ├── globals.css         # グローバル CSS
│   ├── _components/        # app 全体で共有するコンポーネント
│   ├── (page)/             # ページ系ルート（クライアントレンダリング中心）
│   │   ├── layout.tsx      # ルートレイアウト（HTML / フォント / Header / Footer）
│   │   └── (home)/         # トップページ（`/`）
│   │       └── page.tsx
│   └── (server)/           # サーバー系ルート（API・サーバーアクション）
│       └── api/
│           └── route.ts    # `/api` エンドポイント
├── bases/                  # 環境変数・定数などのベース設定
├── libs/                   # 外部ライブラリのラッパー（shadcn 等）
└── utils/                  # ユーティリティ
```

### ルートグループの設計方針

`app/` 直下にルートレイアウト (`layout.tsx`) を置かず、各ルートグループがそれぞれ独自のルートレイアウトを持つ。ランタイムコンテキストと役割の分離が目的。

- **(page)** - UI を返すページルート。`<html>` / フォント / CSS / Header / Footer をすべてこのグループの `layout.tsx` で定義する。
- **(server)** - API Route やサーバー専用のエンドポイント。最小の `<html>` シェルのみ。UI レイアウトは持たない。

この分離により、ページとサーバーロジックが混在せず、各ルートの責務が明確になる。

## 開発

```bash
moon run content:dev       # 開発サーバー起動
moon run content:build     # プロダクションビルド
moon run content:preview   # プロダクションプレビュー
moon run content:check     # lint + format + types チェック
moon run content:format    # lint --fix + fmt
moon run content:test      # テスト実行
```

## shadcn/ui

`:/` エイリアスを使用。oxlint は `src/libs/shadcn/**` を除外済み。
