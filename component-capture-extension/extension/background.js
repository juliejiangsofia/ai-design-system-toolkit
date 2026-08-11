try {
  chrome.action.onClicked.addListener(async (tab) => {
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['content.css'],
      });
    } catch (e) {
      console.warn('CSS inject skipped:', e.message);
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
      });
    } catch (e) {
      console.warn('JS inject skipped:', e.message);
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (typeof window.__ccActivate === 'function') {
          window.__ccActivate();
        }
      },
    });
  });
} catch (e) {
  console.error('Action listener error:', e);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'TAKE_SCREENSHOT') {
    chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 90 })
      .then((dataUrl) => sendResponse({ screenshot: dataUrl }))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }
});
