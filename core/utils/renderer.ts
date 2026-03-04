import { ScrapedContent } from '../scrapers/types';
import { ReadingTheme, themes } from './themes';

export class ReadingRenderer {
  render(content: ScrapedContent, theme: string = 'light'): string {
    const t = themes[theme] || themes.light;
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      background: ${t.background};
      color: ${t.text};
      line-height: 1.8;
      padding: 40px 20px;
    }
    .container {
      max-width: 680px;
      margin: 0 auto;
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: ${t.heading};
      margin-bottom: 24px;
      line-height: 1.3;
    }
    .meta {
      color: ${t.text};
      opacity: 0.6;
      font-size: 14px;
      margin-bottom: 32px;
    }
    p {
      font-size: 18px;
      margin-bottom: 24px;
      text-align: justify;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 32px 0;
      display: block;
    }
    a { color: ${t.link}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      background: ${t.code};
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', monospace;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${content.title}</h1>
    ${content.author || content.publishDate ? `
    <div class="meta">
      ${content.author ? `作者：${content.author}` : ''}
      ${content.publishDate ? ` · ${content.publishDate}` : ''}
    </div>
    ` : ''}
    <div class="content">
      ${this.formatContent(content.content)}
    </div>
  </div>
</body>
</html>`;
  }

  private formatContent(html: string): string {
    // 清理和格式化内容
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '</p><p>')
      .replace(/\n\n+/g, '</p><p>');
  }
}
