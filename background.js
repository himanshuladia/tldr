chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarizeText',
    title: "TL;DR",
    contexts: ["selection"] 
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'summarizeText' && info.selectionText) {
    // Placeholder summarization logic
    const summary = `Summary: ${info.selectionText.substring(0, 100)}${info.selectionText.length > 100 ? '...' : ''}`;

    // Send the summary result to the content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'displaySummary',
      summary: summary
    });
  }
}); 