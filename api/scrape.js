import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async (req, res) => {
  const { url } = req.query;

  // CORS 対応
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!url) {
    res.status(400).json({ error: 'url パラメータが必要です' });
    return;
  }

  // URL の検証
  if (!url.includes('threads.com')) {
    res.status(400).json({ error: '有効な Threads URL ではありません' });
    return;
  }

  try {
    let browser;

    // 環境に応じた Puppeteer の初期化
    if (process.env.VERCEL) {
      // Vercel 環境
      const executablePath = await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v${chromium.version}/chromium-v${chromium.version}-linux-x64.zip`
      );

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    } else {
      // ローカル開発環境
      browser = await puppeteer.launch({
        headless: 'new',
      });
    }

    const page = await browser.newPage();

    // User-Agent を設定
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );

    // Threads ページにアクセス
    console.log(`Navigating to: ${url}`);
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // ページが読み込まれるまで待機
    await page.waitForTimeout(2000);

    // スクリーンショット取得
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 85,
      fullPage: true
    });

    await browser.close();

    // 画像を返す
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'max-age=3600');
    res.setHeader('Content-Length', screenshot.length);
    res.status(200).send(screenshot);

  } catch (error) {
    console.error('Scraping error:', error);

    res.status(500).json({
      error: 'スクリーンショット取得に失敗しました',
      details: error.message,
      url
    });
  }
};
