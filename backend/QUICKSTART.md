# Golang Backend Quick Start Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Test Locally

```bash
# Navigate to backend directory
cd C:\Mine\test\backend

# Run the server
go run main.go
```

Server will start at `http://localhost:8080`

### Step 2: Test API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:8080/health

# Get portfolio data
curl http://localhost:8080/api/portfolio
```

### Step 3: Deploy to Render.com (Free)

1. **Push to GitHub**
   ```bash
   cd C:\Mine\test
   git add .
   git commit -m "Add Golang backend"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com) and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory
   - Click "Create Web Service"
   - Render will auto-detect `render.yaml` and deploy!

3. **Get your API URL**
   - After deployment, you'll get a URL like: `https://portfolio-backend-xxxx.onrender.com`
   - Update `js/api-client.js` line 11 with your URL

## 📋 API Endpoints

### Test with curl:

```bash
# Replace with your deployed URL
API_URL="http://localhost:8080"

# Get portfolio
curl $API_URL/api/portfolio

# Update personal info
curl -X PUT $API_URL/api/personal \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "title": "Developer",
    "email": "your@email.com"
  }'

# Add experience
curl -X POST $API_URL/api/experience/add \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Tech Corp",
    "position": "Developer",
    "startDate": "2024-01",
    "current": true,
    "description": "Working on cool projects"
  }'
```

## 🔧 Configuration

### Update Frontend API URL

Edit `js/api-client.js`:

```javascript
// Line 11 - Change this to your deployed backend URL
this.baseURL = 'https://your-backend.onrender.com';
```

### Enable Backend in Frontend

1. Add API client to `index.html`:
   ```html
   <script src="js/api-client.js"></script>
   ```

2. Add API client to `manage.html`:
   ```html
   <script src="js/api-client.js"></script>
   ```

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if Go is installed
go version

# If not, install from: https://go.dev/dl/
```

### CORS errors?
- Make sure backend is running
- Check browser console for errors
- Verify API URL in `api-client.js`

### Data not saving?
- Check `backend/data/portfolio.json` exists
- Check file permissions
- Look at server logs

## 📁 Project Structure

```
C:\Mine\test\
├── backend/
│   ├── main.go           ← Golang server
│   ├── go.mod            ← Dependencies
│   ├── Dockerfile        ← Docker config
│   ├── render.yaml       ← Render deployment
│   └── data/
│       └── portfolio.json ← Data storage
├── js/
│   ├── api-client.js     ← NEW: API client
│   ├── data-loader.js    ← Update to use API
│   └── manage.js         ← Update to use API
└── index.html
```

## ✅ Next Steps

1. ✅ Backend created
2. ⏳ Test locally
3. ⏳ Deploy to Render
4. ⏳ Update frontend API URL
5. ⏳ Test end-to-end

## 🆘 Need Help?

Check the full documentation:
- `backend/README.md` - Complete backend docs
- `implementation_plan.md` - Full implementation plan

## 🎉 Success!

Once deployed, your portfolio will:
- ✅ Save data to server (not just localStorage)
- ✅ Work from any device
- ✅ Persist data permanently
- ✅ Support real-time updates
