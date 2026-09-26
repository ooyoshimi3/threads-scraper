# Threads スクレイパー

Threads の投稿をスクリーンショットしてダウンロードするシンプルなツール。

## 機能

- ✅ Threads の投稿を PNG/JPEG でスクリーンショット
- ✅ Web UI で簡単に使用可能
- ✅ Vercel でホスト可能
- ✅ URL を入力するだけで自動ダウンロード

## セットアップ

### ローカル開発

```bash
# リポジトリをクローン
git clone <your-repo-url>
cd threads-scraper

# 依存関係をインストール
npm install

# ローカルで実行
npm run dev
```

`http://localhost:3000` でアクセス可能

### Vercel へのデプロイ

1. GitHub にリポジトリをプッシュ
2. [Vercel](https://vercel.com) にログイン
3. 「New Project」をクリック
4. GitHub リポジトリを選択
5. デプロイボタンをクリック

```bash
# または CLI で直接デプロイ
npm install -g vercel
vercel
```

## 使い方

1. Threads の投稿 URL をコピー
   - 例：`https://www.threads.com/share/FLSPoAHBJ/`

2. Web UI でURL を入力

3. 「ダウンロード」ボタンをクリック

4. スクリーンショットが自動でダウンロードされます

## API エンドポイント

```
GET /api/scrape?url=<threads-url>
```

### クエリパラメータ

- `url` (必須): Threads の投稿 URL

### レスポンス

- **成功 (200)**: JPEG 画像 (Content-Type: image/jpeg)
- **エラー (400/500)**: JSON エラーメッセージ

### 使用例

```bash
curl "https://your-vercel-url.vercel.app/api/scrape?url=https://www.threads.com/share/FLSPoAHBJ/" \
  -o screenshot.jpg
```

## 技術スタック

- **フロントエンド**: HTML5 + CSS3 + JavaScript
- **バックエンド**: Node.js + Puppeteer
- **ホスティング**: Vercel Serverless Functions

## 注意事項

- Threads/Instagram の利用規約に従ってください
- 大量アクセスはお控えください
- IP ブロックの可能性があります
- 調査用・個人用途での使用を想定しています

## トラブルシューティング

### Puppeteer メモリエラー

Vercel では 3008 MB のメモリを割り当てています。超過時は `vercel.json` を調整してください。

```json
{
  "functions": {
    "api/scrape.js": {
      "memory": 3008,
      "maxDuration": 60
    }
  }
}
```

### Threads のアクセス拒否

IP ブロックされた場合は、別の Vercel プロジェクトを作成してください。

## ライセンス

MIT
