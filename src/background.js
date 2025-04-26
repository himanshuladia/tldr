import { CONTEXT_MENU_ID, MESSAGE_ACTION_DISPLAY_SUMMARY } from './constants.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "TL;DR",
    contexts: ["selection"] 
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText) {
    // Placeholder summarization logic
    const summary = `Summary: ${info.selectionText.substring(0, 100)}${info.selectionText.length > 100 ? '...' : ''}`;

    // Send the summary result to the content script
    chrome.tabs.sendMessage(tab.id, {
      action: MESSAGE_ACTION_DISPLAY_SUMMARY,
      summary: summary
    });
  }
}); 