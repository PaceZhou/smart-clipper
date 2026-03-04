import { chromium } from 'playwright';
import { IScraper, ScraperConfig, ScrapedContent } from './types';

export class UniversalScraper implements IScraper {
  canHandle(url: string): boolean {
    return true; // 兜底抓取器，处理所有网页
  }

  async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    const browser = await chromium.launch({ headless: config.headless ?? true });
    const page = await browser.newPage();

    await page.goto(config.url, { waitUntil: 'networkidle', timeout: config.timeout ?? 30000 });

    // 智能提取标题
    const title = await page.evaluate(() => {
      return document.querySelector('h1')?.textContent ||
             document.querySelector('title')?.textContent ||
             'Untitled';
    });

    // 智能提取正文
    const content = await page.evaluate(() => {
      const article = document.querySelector('article') ||
                     document.querySelector('main') ||
                     document.querySelector('.content') ||
                     document.body;
      return article?.innerHTML || '';
    });

    // 提取所有图片
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => img.src).filter(src => src && !src.startsWith('data:'));
    });

    await browser.close();

    return { title: title.trim(), content, images };
  }
}
