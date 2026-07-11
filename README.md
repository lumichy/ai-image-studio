# AI Image Studio（AI 画像スタジオ）

LLM と画像生成 AI を組み合わせた、ブラウザで動作する画像生成アプリです。テキスト入力だけで**知識漫画**や**インフォグラフィック**を生成できるほか、一般的な**テキスト-to-画像 / 画像-to-画像**生成にも対応しています。

## 主な機能

| 機能 | 説明 |
|------|------|
| テキスト-to-画像 | プロンプト・スタイル・サイズを指定して画像を生成 |
| 画像-to-画像 | 参考画像をアップロードし、プロンプトに従って画像を編集 |
| 知識漫画生成 | テーマを入力すると、LLM が構成案（ストーリーボード）を提案し、コマ割り漫画を生成 |
| インフォグラフィック生成 | テーマから要点を整理し、視覚的な情報図解を生成 |
| スタイルプリセット | あにめ・写実・油絵・サイバーパンク・水彩・写真など 6 種類 |
| 多言語対応 | フロントエンドに i18n を実装（言語切り替え対応） |
| 画像ダウンロード | 生成した画像をローカルに保存可能 |

## 技術スタック

- **フレームワーク**: Next.js 14+（App Router）フルスタック
- **言語**: TypeScript
- **スタイル**: Tailwind CSS
- **画像生成**: Agnes AI（`apihub.agnes-ai.com`）
- **テキスト生成（漫画・情報図解の構成）**: LLM API（Tencent LKEAP など OpenAI 互換エンドポイント）
- **データベース**: なし（生成結果はその場で返却、保存しません）

## ディレクトリ構成

```
ai-image-studio/
├── package.json
├── next.config.js
├── .env.local                  # API キー（Git 管理外）
├── .gitignore
├── src/
│   ├── app/
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # メインページ
│   │   ├── globals.css         # グローバルスタイル
│   │   └── api/
│   │       ├── generate/
│   │       │   ├── text-to-image/route.ts
│   │       │   ├── image-to-image/route.ts
│   │       │   └── infographic/route.ts
│   │       ├── comic/
│   │       │   ├── recommend/route.ts
│   │       │   └── generate/route.ts
│   │       └── infographic/
│   │           ├── recommend/route.ts
│   │           └── generate/route.ts
│   ├── components/             # UI コンポーネント（13 個）
│   ├── lib/
│   │   ├── agnes.ts            # Agnes API ラッパー
│   │   ├── comic-engine.ts     # 漫画生成エンジン（LLM）
│   │   ├── infographic-engine.ts # 情報図解生成エンジン（LLM）
│   │   ├── constants.ts        # スタイル / サイズ定数
│   │   ├── i18n.ts             # 多言語定義
│   │   └── i18n-context.tsx    # 多言語コンテキスト
│   └── types/
└── docs/
```

## 環境設定

`.env.local` をプロジェクトルートに作成し、以下の変数を設定してください（このファイルは `.gitignore` で除外されています）。

```bash
# .env.local
AGNES_API_KEY=sk-your-agnes-api-key
AGNES_API_BASE_URL=https://apihub.agnes-ai.com/v1

# 漫画 / インフォグラフィック構成用 LLM（OpenAI 互換）
LLM_API_URL=https://your-llm-endpoint/v1
LLM_API_KEY=sk-your-llm-api-key
```

## 起動方法

```bash
npm install
npm run dev
# ブラウザで http://localhost:3000 を開く
```

本番ビルドの場合:

```bash
npm run build
npm run start
```

## API ルート一覧

| メソッド | パス | 説明 |
|----------|------|------|
| POST | `/api/generate/text-to-image` | テキストから画像を生成 |
| POST | `/api/generate/image-to-image` | 参考画像から画像を編集 |
| POST | `/api/generate/infographic` | インフォグラフィックを生成 |
| POST | `/api/comic/recommend` | 漫画の構成案を提案 |
| POST | `/api/comic/generate` | 漫画を生成 |
| POST | `/api/infographic/recommend` | インフォグラフィックの構成案を提案 |
| POST | `/api/infographic/generate` | インフォグラフィックを生成 |

## ライセンス

本リポジトリは個人利用・学習目的で公開されています。再利用の際は各自の責任でご利用ください。
