// 后台脚本 - 处理快捷键
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-reading-mode') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'toggle-reading-mode' });
  }
});
