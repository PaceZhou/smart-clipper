// 在当前页面直接提取内容，无需重新加载
export class ContentExtractor {
  extract() {
    // 移除不需要的元素
    const removeSelectors = [
      'script', 'style', 'nav', 'header', 'footer',
      '.ad', '.advertisement', '.sidebar', '.comments'
    ];
    
    const clone = document.body.cloneNode(true) as HTMLElement;
    removeSelectors.forEach(sel => {
      clone.querySelectorAll(sel).forEach(el => el.remove());
    });

    return {
      title: document.querySelector('h1')?.textContent || document.title,
      author: document.querySelector('meta[name="author"]')?.getAttribute('content') || '',
      content: clone.innerHTML,
      images: Array.from(document.querySelectorAll('img')).map(img => img.src)
    };
  }

  // 注入阅读模式样式（不重新加载）
  applyReadingMode(theme: 'light' | 'dark' | 'sepia') {
    const themes = {
      light: { bg: '#FAFAF8', text: '#1D1D1F' },
      dark: { bg: '#1C1C1E', text: '#E5E5E7' },
      sepia: { bg: '#F4ECD8', text: '#5B4636' }
    };

    const t = themes[theme];
    
    const style = document.createElement('style');
    style.id = 'smart-clipper-reading-mode';
    style.textContent = `
      body { background: ${t.bg} !important; color: ${t.text} !important; }
      * { max-width: 680px !important; margin-left: auto !important; margin-right: auto !important; }
      img { border-radius: 8px !important; }
    `;
    
    document.head.appendChild(style);
  }

  removeReadingMode() {
    document.getElementById('smart-clipper-reading-mode')?.remove();
  }
}
