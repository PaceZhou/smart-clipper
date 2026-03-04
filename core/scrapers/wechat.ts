import { chromium } from 'playwright';
import { IScraper, ScraperConfig, ScrapedContent } from './types';

export class WeChatScraper implements IScraper {
  canHandle(url: string): boolean {
    return url.includes('mp.weixin.qq.com');
  }

  async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    const browser = await chromium.launch({ headless: config.headless ?? false });
    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
    });

    await page.goto(config.url, { waitUntil: 'networkidle', timeout: config.timeout ?? 30000 });
    await page.waitForTimeout(2000);

    const title = await page.locator('#activity-name').textContent() || '';
    const author = await page.locator('#js_name').textContent() || '';
    
    const content = await page.locator('#js_content').innerHTML();
    
    // 提取图片
    const images: string[] = [];
    const imgElements = await page.locator('#js_content img').all();
    for (const img of imgElements) {
      const src = await img.getAttribute('data-src') || 
                   await img.getAttribute('data-original-src') ||
                   await img.getAttribute('src') || '';
      if (src && !src.includes('mmbiz.qpic.cn/mmbiz_svg/')) {
        images.push(src);
      }
    }

    await browser.close();

    return { title: title.trim(), content, images, author: author.trim() };
  }
}
