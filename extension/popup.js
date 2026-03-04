async function changeTheme(theme) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: 'change-theme', theme });
  chrome.storage.local.set({ theme });
}
