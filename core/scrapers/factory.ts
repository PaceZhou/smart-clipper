import { IScraper } from './types';
import { WeChatScraper } from './wechat';
import { UniversalScraper } from './universal';

export class ScraperFactory {
  private scrapers: IScraper[] = [
    new WeChatScraper(),
    new UniversalScraper() // 最后，作为兜底
  ];

  getScraper(url: string): IScraper {
    for (const scraper of this.scrapers) {
      if (scraper.canHandle(url)) {
        return scraper;
      }
    }
    return new UniversalScraper();
  }
}
