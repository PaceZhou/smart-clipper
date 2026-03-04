// 内容脚本 - 在网页上直接操作
let readingModeEnabled = false;
let currentTheme = 'light';

// 监听快捷键
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle-reading-mode') {
    toggleReadingMode();
  } else if (request.action === 'change-theme') {
    currentTheme = request.theme;
    if (readingModeEnabled) {
      applyReadingMode(currentTheme);
    }
  }
});

function toggleReadingMode() {
  readingModeEnabled = !readingModeEnabled;
  
  if (readingModeEnabled) {
    applyReadingMode(currentTheme);
    showNotification('阅读模式已开启');
  } else {
    removeReadingMode();
    showNotification('阅读模式已关闭');
  }
}

function applyReadingMode(theme) {
  const themes = {
    light: { bg: '#FAFAF8', text: '#1D1D1F', heading: '#000' },
    dark: { bg: '#1C1C1E', text: '#E5E5E7', heading: '#FFF' },
    sepia: { bg: '#F4ECD8', text: '#5B4636', heading: '#3E2723' }
  };
  
  const t = themes[theme];
  
  // 移除旧样式
  document.getElementById('smart-clipper-style')?.remove();
  
  // 注入新样式
  const style = document.createElement('style');
  style.id = 'smart-clipper-style';
  style.textContent = `
    body { 
      background: ${t.bg} !important; 
      color: ${t.text} !important;
      padding: 40px 20px !important;
    }
    body > * { 
      max-width: 680px !important; 
      margin-left: auto !important; 
      margin-right: auto !important; 
    }
    h1, h2, h3 { color: ${t.heading} !important; }
    img { border-radius: 8px !important; max-width: 100% !important; }
    p { line-height: 1.8 !important; font-size: 18px !important; }
  `;
  document.head.appendChild(style);
}

function removeReadingMode() {
  document.getElementById('smart-clipper-style')?.remove();
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 999999;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white; padding: 16px 24px; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
