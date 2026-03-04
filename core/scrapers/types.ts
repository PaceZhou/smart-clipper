// 通用抓取器接口
export interface ScraperConfig {
  url: string;
  headless?: boolean;
  timeout?: number;
}

export interface ScrapedContent {
  title: string;
  content: string;
  images: string[];
  author?: string;
  publishDate?: string;
  metadata?: Record<string, any>;
}

export interface IScraper {
  scrape(config: ScraperConfig): Promise<ScrapedContent>;
  canHandle(url: string): boolean;
}
