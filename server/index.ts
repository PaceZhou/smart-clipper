import express from 'express';
import cors from 'cors';
import { ScraperFactory } from '../core/scrapers/factory';
import { NotionExporter } from '../core/exporters/notion';

const app = express();
app.use(cors());
app.use(express.json());

const scraperFactory = new ScraperFactory();

app.post('/api/clip', async (req, res) => {
  try {
    const { url, notionApiKey, notionDbId } = req.body;
    
    const scraper = scraperFactory.getScraper(url);
    const content = await scraper.scrape({ url });
    
    if (notionApiKey && notionDbId) {
      const exporter = new NotionExporter({ apiKey: notionApiKey, databaseId: notionDbId });
      const pageId = await exporter.export(content, url);
      res.json({ success: true, pageId, content });
    } else {
      res.json({ success: true, content });
    }
  } catch (error: any) {
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 SmartClipper server running on port ${PORT}`));
