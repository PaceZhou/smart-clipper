import { chromium } from 'playwright';
import { IScraper, ScraperConfig, ScrapedContent } from './types';

export class UniversalScraper implements IScraper {
  canHandle(url: string): boolean {
    return true;
  }

  async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    const browser = await chromium.launch({ headless: config.headless ?? true });
    const page = await browser.newPage();

    await page.goto(config.url, { waitUntil: 'networkidle', timeout: config.timeout ?? 30000 });
    await page.waitForTimeout(1000);

    // 智能提取标题
    const title = await this.extractTitle(page);
    
    // 智能提取作者和日期
    const metadata = await this.extractMetadata(page);
    
    // 智能提取正文
    const content = await this.extractContent(page);
    
    // 提取图片（处理懒加载）
    const images = await this.extractImages(page);

    await browser.close();

    return { 
      title, 
      content, 
      images, 
      author: metadata.author,
      publishDate: metadata.date,
      metadata 
    };
  }

  private async extractTitle(page: any): Promise<string> {
    return await page.evaluate(() => {
      // 优先级：h1 > og:title > title > 第一个大标题
      return document.querySelector('h1')?.textContent?.trim() ||
             document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
             document.querySelector('title')?.textContent?.trim() ||
             document.querySelector('.title, .post-title, .article-title')?.textContent?.trim() ||
             'Untitled';
    });
  }

  private async extractMetadata(page: any): Promise<any> {
    return await page.evaluate(() => {
      const author = document.querySelector('meta[name="author"]')?.getAttribute('content') ||
                    document.querySelector('.author, .post-author')?.textContent?.trim() ||
                    '';
      
      const date = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
                  document.querySelector('time')?.getAttribute('datetime') ||
                  document.querySelector('.date, .post-date')?.textContent?.trim() ||
                  '';
      
      return { author, date };
    });
  }

  private async extractContent(page: any): Promise<string> {
    return await page.evaluate(() => {
      // 移除不需要的元素
      const removeSelectors = [
        'script', 'style', 'nav', 'header', 'footer', 
        '.ad', '.advertisement', '.sidebar', '.comments',
        '.social-share', '.related-posts', '#comments'
      ];
      
      removeSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });

      // 多策略提取正文
      const contentEl = document.querySelector('article') ||
                       document.querySelector('main') ||
                       document.querySelector('[role="main"]') ||
                       document.querySelector('.content, .post-content, .article-content') ||
                       document.querySelector('.entry-content, .post-body') ||
                       document.body;
      
      return contentEl?.innerHTML || '';
    });
  }

  private async extractImages(page: any): Promise<string[]> {
    // 滚动页面触发懒加载
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);

    return await page.evaluate(() => {
      const images: string[] = [];
      const imgElements = document.querySelectorAll('img');
      
      imgElements.forEach(img => {
        const src = img.getAttribute('data-src') ||
                   img.getAttribute('data-original') ||
                   img.getAttribute('data-lazy-src') ||
                   img.src;
        
        if (src && !src.startsWith('data:') && src.length > 20) {
          images.push(src);
        }
      });
      
      return [...new Set(images)]; // 去重
    });
  }
}
