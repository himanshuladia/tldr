import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Skip local model checks for faster loading in environments like extensions
env.allowLocalModels = false;
// Force single-threaded WASM backend to avoid createObjectURL error in service worker
env.backends.onnx.wasm.numThreads = 1;

// Define constants (as we removed the constants file)
const CONTEXT_MENU_ID = 'summarizeText';
const MESSAGE_ACTION_DISPLAY_SUMMARY = 'displaySummary';
const MESSAGE_ACTION_SHOW_LOADING = 'showLoading';

// Variable to hold the summarization pipeline
let summarizer = null;

// Function to initialize the pipeline
async function initializeSummarizer() {
  console.log('[Background] Initializing summarization pipeline...');
  try {
    summarizer = await pipeline('summarization', 'Xenova/t5-small');
    console.log('[Background] Summarization pipeline initialized successfully.');
  } catch (error) {
    console.error('[Background] Error initializing summarization pipeline:', error);
  }
}

// Initialize on startup
initializeSummarizer();

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "TL;DR (Summarize Locally)", // Updated title
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => { // Make listener async
  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText) {
    console.log('[Background] Context menu clicked for summarization.');

    // 1. Tell content script to show loading
    chrome.tabs.sendMessage(tab.id, { action: MESSAGE_ACTION_SHOW_LOADING });

    // 2. Check if pipeline is ready, wait if necessary (it should be initialized on startup, but add check)
    if (!summarizer) {
      console.log('[Background] Summarizer not ready yet, attempting initialization...');
      await initializeSummarizer(); // Re-attempt initialization if failed
      if (!summarizer) {
         console.error('[Background] Summarizer failed to initialize. Cannot summarize.');
         // TODO: Send error message to content script
         return; 
      }
    }

    // 3. Perform summarization
    try {
      console.log('[Background] Starting summarization for text:', info.selectionText.substring(0, 100) + '...');
      const result = await summarizer(info.selectionText, {
          max_length: 200, // Adjust max length as needed
          min_length: 30,  // Adjust min length as needed
      });
      
      const summary = result[0].summary_text;
      console.log('[Background] Summarization complete:', summary);

      // 4. Send the summary result to the content script
      chrome.tabs.sendMessage(tab.id, {
        action: MESSAGE_ACTION_DISPLAY_SUMMARY,
        summary: summary
      });

    } catch (error) {
      console.error('[Background] Error during summarization:', error);
      // TODO: Send error message to content script
    }
  }
}); 