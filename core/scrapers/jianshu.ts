import { chromium } from 'playwright';
import { IScraper, ScraperConfig, ScrapedContent } from './types';

// 简书专用抓取器
export class JianshuScraper implements IScraper {
  canHandle(url: string): boolean {
    return url.includes('jianshu.com');
  }

  async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    const browser = await chromium.launch({ headless: config.headless ?? true });
    const page = await browser.newPage();
    await page.goto(config.url, { waitUntil: 'networkidle' });

    const title = await page.locator('h1._1RuRku').textContent() || '';
    const author = await page.locator('.FxYr8x a').textContent() || '';
    const content = await page.locator('article').innerHTML();
    const images = await page.evaluate(() => 
      Array.from(document.querySelectorAll('article img')).map(img => (img as HTMLImageElement).src)
    );

    await browser.close();
    return { title: title.trim(), content, images, author: author.trim() };
  }
}
