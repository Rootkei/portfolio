# Frontend Data Loading Strategy

## 📊 Data Flow

```
Frontend Load Request
    ↓
Try API (backend/data/portfolio.json)
    ↓
✅ Success → Cache to localStorage → Display
    ↓
❌ Failed → Try localStorage (offline mode)
    ↓
✅ Found → Display (offline)
    ↓
❌ Not found → Show empty portfolio
```

## 🔧 Configuration

### Backend Data Location
```
backend/data/portfolio.json  ← Single source of truth
```

### Frontend Cache
```
localStorage['portfolioData']  ← Offline cache only
```

## ✅ Benefits

1. **Single Source of Truth**: Data chỉ tồn tại ở backend
2. **Offline Support**: Cache trong localStorage
3. **Always Fresh**: Mỗi lần load sẽ fetch từ API
4. **Backup**: Backend tự động tạo backup khi save

## 🚀 How It Works

### On Page Load (index.html, manage.html)
1. Call `dataLoader.loadData()`
2. Try fetch from API: `GET /api/portfolio`
3. If success: cache to localStorage
4. If fail: use localStorage (offline mode)

### On Save (manage.html)
1. User clicks "Lưu"
2. Call `PUT /api/portfolio/update`
3. Backend updates `backend/data/portfolio.json`
4. Backend creates backup
5. Frontend updates localStorage cache

## 📁 File Structure

```
C:\Mine\test\
├── backend/
│   └── data/
│       ├── portfolio.json          ← MAIN DATA
│       └── portfolio_backup_*.json ← AUTO BACKUPS
├── data/
│   └── (empty or template only)
└── js/
    ├── data-loader.js  ← Loads from API
    └── api-client.js   ← API wrapper
```

## 🔄 Migration Complete

- ✅ Backend has portfolio.json
- ✅ Frontend loads from API
- ✅ localStorage used for offline only
- ✅ No duplicate data files
