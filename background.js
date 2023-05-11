let siteData = {};

chrome.alarms.create({ periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm fired:', alarm);
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    console.log('Tabs queried:', tabs);
    
    if (tabs == null || tabs.length == 0) {
    	console.log('Invalid tab/url:', tabs)
    	return;
    	
    }
    
    const tab = tabs[0];
    if (!tab || !tab.url) {
    	console.log('Invalid tab/url:', tab)
      return; // Exit if tab or URL is invalid
    }
    try {
      const { hostname } = new URL(tab.url);
      if (siteData[hostname]) {
        siteData[hostname] += 1;
      } else {
        siteData[hostname] = 1;
      }
      if (siteData[hostname] > 1) {
        chrome.tabs.sendMessage(tab.id, { action: 'block_site' });
        siteData[hostname] = 0;
      }
    } catch (error) {
      console.error('Error getting URL:', error);
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  if (message.action === 'get_site_data') {
    sendResponse(siteData);
  }
});
