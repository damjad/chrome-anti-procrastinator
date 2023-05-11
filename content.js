chrome.runtime.sendMessage({ action: 'get_site_data' }, (response) => {
  console.log('Site data received:', response);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'block_site') {
    document.body.innerHTML = `
      <div style="font-size: 24px; font-weight: bold; text-align: center; margin-top: 50px;">
        This site has been blocked for the next hour due to excessive usage.
      </div>
    `;
    setTimeout(() => {
      location.reload();
    }, 3600000);
  }
});
