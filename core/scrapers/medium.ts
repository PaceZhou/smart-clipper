import { chromium } from 'playwright';
import { IScraper, ScraperConfig, ScrapedContent } from './types';

// Medium 专用抓取器
export class MediumScraper implements IScraper {
  canHandle(url: string): boolean {
    return url.includes('medium.com');
  }

  async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    const browser = await chromium.launch({ headless: config.headless ?? true });
    const page = await browser.newPage();
    await page.goto(config.url, { waitUntil: 'networkidle' });

    const title = await page.locator('h1').first().textContent() || '';
    const author = await page.locator('[data-testid="authorName"]').textContent() || '';
    const content = await page.locator('article').innerHTML();
    const images = await page.evaluate(() => 
      Array.from(document.querySelectorAll('article img')).map(img => img.src)
    );

    await browser.close();
    return { title: title.trim(), content, images, author: author.trim() };
  }
}
