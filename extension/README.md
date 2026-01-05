# LinkedIn Sync Chrome Extension

## 🎯 Overview

A Chrome Extension that automatically syncs your LinkedIn profile data to your portfolio with one click!

## ✨ Features

- ✅ **One-Click Sync** - Extract LinkedIn data instantly
- ✅ **Auto-Merge** - Intelligently merges with existing portfolio
- ✅ **Real-time Status** - Shows LinkedIn detection and API connection
- ✅ **Configurable** - Set your own backend API URL
- ✅ **Professional UI** - Beautiful gradient design

## 📦 What Gets Synced

- **Personal Info**: Name, title, location, bio, photo
- **Work Experience**: Company, position, dates, description
- **Education**: School, degree, field, dates
- **Skills**: All your LinkedIn skills
- **Certifications**: Professional certifications

## 🚀 Installation

### Step 1: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `extension` folder: `C:\Mine\test\extension`
5. Extension will appear in your toolbar!

### Step 2: Pin Extension (Optional)

1. Click the puzzle icon in Chrome toolbar
2. Find "Portfolio LinkedIn Sync"
3. Click the pin icon to keep it visible

## 📖 How to Use

### Method 1: From LinkedIn Profile

1. **Go to your LinkedIn profile**
   - Navigate to `https://www.linkedin.com/in/your-profile`
   - Make sure you're logged in

2. **Click the extension icon**
   - You'll see "LinkedIn Page: Detected ✓"
   - Backend API status will show

3. **Click "Sync LinkedIn Data"**
   - Extension extracts your data
   - Merges with existing portfolio
   - Syncs to backend
   - Done! ✅

### Method 2: Configure API URL

If your backend is not on `localhost:8080`:

1. Click extension icon
2. Scroll to "Backend API URL"
3. Enter your backend URL (e.g., `https://your-api.onrender.com`)
4. URL is saved automatically

## 🔧 Requirements

- ✅ Chrome browser (or Edge, Brave, etc.)
- ✅ Backend API running (`go run main.go`)
- ✅ LinkedIn account (logged in)

## 📁 Extension Structure

```
extension/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic
├── content.js          # LinkedIn data extraction
├── background.js       # Background service worker
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🎨 Extension UI

The extension popup shows:
- **LinkedIn Status**: Whether you're on LinkedIn
- **API Status**: Backend connection status
- **Sync Button**: One-click sync
- **Open Portfolio**: Quick link to manage.html
- **API URL Config**: Change backend URL

## 🔍 How It Works

1. **Detection**: Extension detects when you're on LinkedIn
2. **Extraction**: Content script reads profile data from DOM
3. **Merging**: Popup script merges with existing portfolio
4. **Syncing**: Sends merged data to backend API
5. **Storage**: Backend saves to `portfolio.json`

## ⚙️ Technical Details

### Content Script (content.js)
- Runs on all LinkedIn pages
- Extracts data using DOM selectors
- Handles different LinkedIn layouts

### Popup (popup.js)
- Manages UI state
- Coordinates data extraction
- Handles API communication
- Merges data intelligently

### Background Worker (background.js)
- Monitors extension state
- Shows badge when on LinkedIn

## 🐛 Troubleshooting

### "Not on LinkedIn" message
- Make sure you're on `linkedin.com/in/your-profile`
- Refresh the page and try again

### "Backend API: Offline"
- Check if backend is running: `go run main.go`
- Verify API URL in extension settings
- Check CORS is enabled in backend

### Data not syncing
- Open browser Console (F12)
- Look for error messages
- Check backend logs

### LinkedIn layout changed
- LinkedIn may update their HTML structure
- Extension selectors may need updating
- Report issue for fix

## 🔐 Privacy & Security

- ✅ Extension only runs on LinkedIn
- ✅ Data stays on your local backend
- ✅ No data sent to third parties
- ✅ Open source - review the code!

## 📝 Notes

- Extension works best on your own LinkedIn profile
- Some data may require manual review/editing
- LinkedIn's HTML structure may change over time
- Always verify synced data in manage.html

## 🎉 Success!

Once installed, you can:
1. Visit your LinkedIn profile
2. Click extension icon
3. Click "Sync LinkedIn Data"
4. Check `manage.html` to see synced data!

## 🔄 Updating Extension

If you make changes to extension files:
1. Go to `chrome://extensions/`
2. Click refresh icon on the extension card
3. Changes will be applied immediately

## 📧 Support

If you encounter issues:
- Check browser console for errors
- Check backend logs
- Verify you're on your LinkedIn profile page
- Make sure backend API is running
