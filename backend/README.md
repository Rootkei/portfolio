# Portfolio Backend API

Golang REST API for managing portfolio data with JSON file storage.

## 🚀 Features

- ✅ RESTful API endpoints
- ✅ JSON file-based storage
- ✅ CORS enabled
- ✅ Automatic backups
- ✅ Health check endpoint
- ✅ Docker support
- ✅ Zero external dependencies

## 📋 API Endpoints

### Health Check
```
GET /health
```

### Portfolio Operations
```
GET    /api/portfolio           - Get complete portfolio
PUT    /api/portfolio/update    - Update complete portfolio
PUT    /api/personal            - Update personal info
POST   /api/experience/add      - Add experience
PUT    /api/experience/update   - Update experience
DELETE /api/experience/delete   - Delete experience
```

## 🛠️ Local Development

### Prerequisites
- Go 1.21 or higher

### Run Locally
```bash
cd backend
go run main.go
```

Server will start on `http://localhost:8080`

### Test API
```bash
# Health check
curl http://localhost:8080/health

# Get portfolio
curl http://localhost:8080/api/portfolio

# Update personal info
curl -X PUT http://localhost:8080/api/personal \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","title":"Developer",...}'
```

## 🐳 Docker Deployment

### Build Image
```bash
cd backend
docker build -t portfolio-backend .
```

### Run Container
```bash
docker run -p 8080:8080 \
  -v $(pwd)/data:/app/data \
  portfolio-backend
```

## ☁️ Deploy to Render.com

### Step 1: Create `render.yaml`
Already included in the project.

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Add Golang backend"
git push origin main
```

### Step 3: Deploy on Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click "Create Web Service"

Your API will be live at: `https://your-app.onrender.com`

## ☁️ Deploy to Railway.app

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login and Deploy
```bash
cd backend
railway login
railway init
railway up
```

## 📁 Project Structure

```
backend/
├── main.go              # Main server file
├── go.mod               # Go module file
├── Dockerfile           # Docker configuration
├── render.yaml          # Render deployment config
├── .gitignore          # Git ignore rules
└── data/
    └── portfolio.json   # Portfolio data (auto-created)
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 8080)

### Data Storage
- Portfolio data is stored in `data/portfolio.json`
- Automatic backups created on each update: `data/portfolio_backup_<timestamp>.json`

## 🌐 CORS

CORS is enabled for all origins (`*`). For production, update the CORS middleware in `main.go`:

```go
w.Header().Set("Access-Control-Allow-Origin", "https://yourdomain.com")
```

## 📝 Example Requests

### Get Portfolio
```javascript
fetch('http://localhost:8080/api/portfolio')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Update Personal Info
```javascript
fetch('http://localhost:8080/api/personal', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Nguyen Vinh Ky',
    title: 'Full Stack Developer',
    email: 'info.vinhky@gmail.com',
    // ... other fields
  })
});
```

### Add Experience
```javascript
fetch('http://localhost:8080/api/experience/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company: 'Tech Company',
    position: 'Developer',
    startDate: '2024-01',
    current: true,
    // ... other fields
  })
});
```

## 🔐 Security Notes

For production deployment:
1. Add authentication middleware
2. Restrict CORS to your domain
3. Add rate limiting
4. Use HTTPS
5. Validate all inputs
6. Add logging

## 📊 Monitoring

Health check endpoint for monitoring:
```bash
curl https://your-api.onrender.com/health
```

Response:
```json
{
  "status": "healthy",
  "time": "2024-01-01T12:00:00Z"
}
```

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License
