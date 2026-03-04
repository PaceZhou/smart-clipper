import { IScraper } from './types';
import { WeChatScraper } from './wechat';
import { MediumScraper } from './medium';
import { ZhihuScraper } from './zhihu';
import { JianshuScraper } from './jianshu';
import { UniversalScraper } from './universal';

export class ScraperFactory {
  private scrapers: IScraper[] = [
    new WeChatScraper(),
    new MediumScraper(),
    new ZhihuScraper(),
    new JianshuScraper(),
    new UniversalScraper() // 兜底
  ];

  getScraper(url: string): IScraper {
    for (const scraper of this.scrapers) {
      if (scraper.canHandle(url)) {
        return scraper;
      }
    }
    return new UniversalScraper();
  }

  // 获取支持的网站列表
  getSupportedSites(): string[] {
    return [
      '微信公众号 (mp.weixin.qq.com)',
      'Medium (medium.com)',
      '知乎 (zhihu.com)',
      '简书 (jianshu.com)',
      '通用网页 (所有其他网站)'
    ];
  }
}
