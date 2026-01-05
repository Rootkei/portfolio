// Background Service Worker
console.log('🔧 LinkedIn Sync Extension - Background Service Worker');

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'onLinkedIn') {
        console.log('✅ User is on LinkedIn:', request.url);
        // Could add badge or notification here
        chrome.action.setBadgeText({ text: '✓' });
        chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    }
    return true;
});

// Extension installed
chrome.runtime.onInstalled.addListener(() => {
    console.log('🎉 LinkedIn Sync Extension installed');

    // Set default API URL
    chrome.storage.local.set({
        apiUrl: 'http://localhost:8080'
    });
});
