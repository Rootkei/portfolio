# Extension Debugging Guide

## ❌ "Failed to sync to backend" Error

### Quick Fixes:

#### 1. **Restart Backend với CORS mới**
```bash
# Stop backend (Ctrl+C)
cd C:\Mine\test\backend
go run main.go
```

Backend đã được update để support chrome-extension origins.

#### 2. **Check Backend đang chạy**
```bash
# Test health endpoint
curl http://localhost:8080/health
```

Hoặc mở browser: `http://localhost:8080/health`

#### 3. **Check Extension Console**
1. Click extension icon
2. Right-click popup → "Inspect"
3. Xem Console tab có lỗi gì
4. Xem Network tab để check API calls

#### 4. **Check Content Script Console**
1. Vào LinkedIn profile
2. F12 → Console tab
3. Xem có lỗi từ content.js không

### Common Issues:

#### Issue 1: CORS Error
**Triệu chứng:**
```
Access to fetch at 'http://localhost:8080/api/portfolio/update' 
from origin 'chrome-extension://...' has been blocked by CORS
```

**Fix:**
- ✅ Backend đã update CORS để allow chrome-extension
- Restart backend: `go run main.go`

#### Issue 2: Backend Offline
**Triệu chứng:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Fix:**
- Check backend đang chạy
- Check port 8080 không bị chiếm
- Verify API URL trong extension settings

#### Issue 3: Wrong API URL
**Triệu chứng:**
```
404 Not Found
```

**Fix:**
1. Click extension icon
2. Check "Backend API URL"
3. Đảm bảo là: `http://localhost:8080`
4. Không có trailing slash

#### Issue 4: LinkedIn Data Extraction Failed
**Triệu chứng:**
```
Failed to extract data from LinkedIn
```

**Fix:**
- Đảm bảo bạn đang ở trang profile: `linkedin.com/in/your-name`
- Refresh trang LinkedIn
- Scroll xuống để load hết sections
- LinkedIn có thể đã thay đổi HTML structure

### Debug Steps:

#### Step 1: Test Backend API Manually
```bash
# Test GET
curl http://localhost:8080/api/portfolio

# Test PUT
curl -X PUT http://localhost:8080/api/portfolio/update \
  -H "Content-Type: application/json" \
  -d '{"personal":{"name":"Test"}}'
```

#### Step 2: Check Extension Permissions
1. Go to `chrome://extensions/`
2. Find "Portfolio LinkedIn Sync"
3. Click "Details"
4. Check "Site access" includes LinkedIn

#### Step 3: Reload Extension
1. Go to `chrome://extensions/`
2. Click refresh icon on extension
3. Try sync again

#### Step 4: Check Browser Console
1. Open extension popup
2. Right-click → Inspect
3. Go to Console tab
4. Look for error messages
5. Check Network tab for failed requests

### Test Sync Manually:

#### Test 1: Health Check
```javascript
// In extension popup console
fetch('http://localhost:8080/health')
  .then(r => r.json())
  .then(console.log)
```

#### Test 2: Get Portfolio
```javascript
fetch('http://localhost:8080/api/portfolio')
  .then(r => r.json())
  .then(console.log)
```

#### Test 3: Update Portfolio
```javascript
fetch('http://localhost:8080/api/portfolio/update', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    personal: {name: 'Test'},
    social: [],
    experience: [],
    education: [],
    skills: {},
    projects: [],
    certifications: []
  })
})
.then(r => r.json())
.then(console.log)
```

### Still Not Working?

1. **Check backend logs** - Xem terminal đang chạy `go run main.go`
2. **Try different browser** - Test trên Chrome Incognito
3. **Disable other extensions** - Có thể conflict
4. **Check firewall** - Có thể block localhost:8080

### Success Indicators:

When working correctly, you should see:
- ✅ Extension popup: "LinkedIn Page: Detected ✓"
- ✅ Extension popup: "Backend API: Connected ✓"
- ✅ Console: "📊 Extracting LinkedIn data..."
- ✅ Console: "✅ Data extracted"
- ✅ Console: "✅ Data saved to backend"
- ✅ Message: "✅ Successfully synced LinkedIn data!"

### Get More Help:

1. Export extension console logs
2. Export backend logs
3. Check `manage.html` - data có sync không?
4. Try manual sync via manage.html
