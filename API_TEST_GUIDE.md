# API Integration Test Guide

## ✅ Kiểm tra Backend đang chạy

### 1. Kiểm tra Backend
```bash
# Terminal 1: Chạy backend
cd C:\Mine\test\backend
go run main.go

# Bạn sẽ thấy:
# 🚀 Server starting on port 8080
# 📁 Data file: data/portfolio.json
# 🌐 CORS enabled for all origins
```

### 2. Test API bằng Browser
Mở browser và vào: `http://localhost:8080/health`

Bạn sẽ thấy:
```json
{
  "status": "healthy",
  "time": "2025-12-17T..."
}
```

### 3. Test Portfolio API
Mở: `http://localhost:8080/api/portfolio`

Bạn sẽ thấy toàn bộ portfolio data dạng JSON.

## 🎯 Test Frontend Integration

### 1. Mở Management Dashboard
```
http://localhost:8080/manage.html
```
(Hoặc mở file trực tiếp nếu dùng Live Server)

### 2. Mở Browser Console (F12)
Bạn sẽ thấy:
```
🚀 API Integration helper loaded
🔌 API Integration enabled
✅ Backend connected: {status: "healthy", time: "..."}
✅ Đã kết nối backend API!
```

### 3. Test Save Operation
1. Sửa thông tin cá nhân (tên, email, etc.)
2. Click "Lưu Thông Tin"
3. Xem Console, bạn sẽ thấy:
   ```
   ✅ Data saved to backend
   ```

### 4. Kiểm tra File JSON đã cập nhật
```bash
# Xem file portfolio.json
cat C:\Mine\test\backend\data\portfolio.json

# Hoặc
notepad C:\Mine\test\backend\data\portfolio.json
```

File này sẽ có thông tin mới bạn vừa lưu!

## 🐛 Troubleshooting

### Lỗi: "Failed to save to backend"
**Nguyên nhân:** Backend không chạy hoặc URL sai

**Giải pháp:**
1. Kiểm tra backend đang chạy: `http://localhost:8080/health`
2. Kiểm tra Console có lỗi CORS không
3. Kiểm tra `js/api-client.js` line 11 có đúng URL không

### Lỗi: CORS
**Nguyên nhân:** Browser block request

**Giải pháp:**
- Backend đã enable CORS, không cần làm gì
- Nếu vẫn lỗi, dùng Chrome với flag: `--disable-web-security`

### Data không lưu
**Nguyên nhân:** Backend không có quyền ghi file

**Giải pháp:**
```bash
# Tạo thư mục data nếu chưa có
mkdir C:\Mine\test\backend\data

# Copy portfolio.json vào
copy C:\Mine\test\data\portfolio.json C:\Mine\test\backend\data\
```

## ✅ Success Indicators

Khi mọi thứ hoạt động đúng:

1. ✅ Console hiện: "Backend connected"
2. ✅ Khi save, console hiện: "Data saved to backend"
3. ✅ File `backend/data/portfolio.json` được cập nhật
4. ✅ File backup được tạo: `backend/data/portfolio_backup_*.json`
5. ✅ Không có lỗi trong Console

## 📊 Flow Diagram

```
User clicks "Lưu"
    ↓
savePersonal() called
    ↓
saveToStorage() called
    ↓
├─→ Save to localStorage (offline)
└─→ Call API: PUT /api/portfolio/update
        ↓
    Backend receives data
        ↓
    ├─→ Create backup
    └─→ Write to portfolio.json
        ↓
    Return success
        ↓
    Console: "✅ Data saved to backend"
```

## 🎉 Next Steps

Sau khi test thành công local:

1. Deploy backend lên Render.com
2. Update `js/api-client.js` với production URL
3. Deploy frontend lên GitHub Pages
4. Test end-to-end!
