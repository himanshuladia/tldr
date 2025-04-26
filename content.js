chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'displaySummary') {
    console.log("Content script received summary:", request.summary);

    // Remove any existing summary box first
    const existingBox = document.getElementById('tldr-summary-box');
    if (existingBox) {
      existingBox.remove();
    }

    // Create the summary box
    const summaryBox = document.createElement('div');
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

    // Add Summary Title
    const title = document.createElement('h4');
    title.textContent = 'TL;DR Summary:';
    title.style.marginTop = '0';
    title.style.marginBottom = '10px';
    summaryBox.appendChild(title);

    // Add Summary Text
    const summaryText = document.createElement('p');
    summaryText.textContent = request.summary;
    summaryText.style.marginBottom = '10px';
    summaryBox.appendChild(summaryText);

    // Add Close Button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.padding = '5px 10px';
    closeButton.style.border = '1px solid #ccc';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      summaryBox.remove();
    };
    summaryBox.appendChild(closeButton);

    // Append the box to the body
    document.body.appendChild(summaryBox);

    // Optional: Send a response back if needed
    // sendResponse({ status: "displayed" });
  }
}); 