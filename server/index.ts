import express from 'express';
import cors from 'cors';
import { ScraperFactory } from '../core/scrapers/factory';
import { NotionExporter } from '../core/exporters/notion';
import { ReadingRenderer } from '../core/utils/renderer';

const app = express();
app.use(cors());
app.use(express.json());

const scraperFactory = new ScraperFactory();
const renderer = new ReadingRenderer();

app.get('/api/supported-sites', (req, res) => {
  res.json({ sites: scraperFactory.getSupportedSites() });
});

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

app.post('/api/preview', async (req, res) => {
  try {
    const { url, theme = 'light' } = req.body;
    
    const scraper = scraperFactory.getScraper(url);
    const content = await scraper.scrape({ url });
    
    const html = renderer.render(content, theme);
    res.send(html);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/preview.html');
});
