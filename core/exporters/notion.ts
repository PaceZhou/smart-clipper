import { Client } from '@notionhq/client';
import { ScrapedContent } from '../scrapers/types';

export interface NotionExporterConfig {
  apiKey: string;
  databaseId: string;
}

export class NotionExporter {
  private notion: Client;
  private databaseId: string;

  constructor(config: NotionExporterConfig) {
    this.notion = new Client({ auth: config.apiKey });
    this.databaseId = config.databaseId;
  }

  async export(content: ScrapedContent, sourceUrl: string): Promise<string> {
    const page = await this.notion.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        Name: { title: [{ text: { content: content.title } }] },
        URL: { url: sourceUrl }
      }
    });

    // TODO: 添加内容块（图片、文本）
    
    return page.id;
  }
}
