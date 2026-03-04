import { chromium } from 'playwright';
import { IScraper, ScraperConfig, ScrapedContent } from './types';

// 知乎专用抓取器
export class ZhihuScraper implements IScraper {
  canHandle(url: string): boolean {
    return url.includes('zhihu.com');
  }

  async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    const browser = await chromium.launch({ headless: config.headless ?? true });
    const page = await browser.newPage();
    await page.goto(config.url, { waitUntil: 'networkidle' });

    const title = await page.locator('h1.QuestionHeader-title').textContent() || 
                  await page.locator('.Post-Title').textContent() || '';
    
    const author = await page.locator('.AuthorInfo-name').first().textContent() || '';
    
    const content = await page.locator('.RichContent-inner, .Post-RichText').first().innerHTML();
    
    const images = await page.evaluate(() => 
      Array.from(document.querySelectorAll('.RichContent img, .Post-RichText img'))
        .map(img => (img as HTMLImageElement).getAttribute('data-original') || (img as HTMLImageElement).src)
    );

    await browser.close();
    return { title: title.trim(), content, images, author: author.trim() };
  }
}
