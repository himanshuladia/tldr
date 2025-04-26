// Define constants (as we removed the constants file)
const MESSAGE_ACTION_DISPLAY_SUMMARY = 'displaySummary';
const MESSAGE_ACTION_SHOW_LOADING = 'showLoading';

// Function to create or update the summary box
function displaySummaryBox(content) {
  // Remove any existing summary box first
  let summaryBox = document.getElementById('tldr-summary-box');
  if (summaryBox) {
    // If box exists, just update content
    summaryBox.innerHTML = ''; // Clear previous content
  } else {
    // If box doesn't exist, create it
    summaryBox = document.createElement('div');
    summaryBox.id = 'tldr-summary-box';
    summaryBox.style.position = 'fixed';
    summaryBox.style.bottom = '20px';
    summaryBox.style.right = '20px';
    summaryBox.style.width = '300px';
    summaryBox.style.padding = '15px';
    summaryBox.style.backgroundColor = 'white';
    summaryBox.style.border = '1px solid #ccc';
    summaryBox.style.borderRadius = '5px';
    summaryBox.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    summaryBox.style.zIndex = '9999';
    summaryBox.style.fontFamily = 'sans-serif';
    summaryBox.style.fontSize = '14px';
    summaryBox.style.lineHeight = '1.4';
    summaryBox.style.color = '#333';
    document.body.appendChild(summaryBox);
  }

  // Add the new content (can be loading indicator or summary)
  summaryBox.appendChild(content);

  // Add Close Button (always add/re-add it)
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.padding = '8px 10px';
  closeButton.style.marginTop = '10px';
  closeButton.style.border = '1px solid #ccc';
  closeButton.style.borderRadius = '3px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => {
    summaryBox.remove();
  };
  summaryBox.appendChild(closeButton);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === MESSAGE_ACTION_SHOW_LOADING) {
    console.log("[Content] Received SHOW_LOADING request.");
    const loadingContent = document.createElement('div');
    loadingContent.textContent = 'Summarizing...'; // Simple loading text
    // You could add a spinner GIF or CSS animation here later
    displaySummaryBox(loadingContent);

  } else if (request.action === MESSAGE_ACTION_DISPLAY_SUMMARY) {
    console.log("[Content] Received DISPLAY_SUMMARY request:", request.summary);
    
    const summaryContent = document.createElement('div');

    // Add Summary Title
    const title = document.createElement('h4');
    title.textContent = 'TL;DR Summary:';
    title.style.marginTop = '0';
    title.style.marginBottom = '10px';
    summaryContent.appendChild(title);

    // Add Summary Text
    const summaryText = document.createElement('p');
    summaryText.textContent = request.summary;
    summaryText.style.marginBottom = '0'; // Remove default margin if close button is below
    summaryContent.appendChild(summaryText);

    displaySummaryBox(summaryContent);
  }
}); 