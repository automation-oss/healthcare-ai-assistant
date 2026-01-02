# Quick Start Guide

## Windows PowerShell Setup

### Step 1: Install Dependencies

```powershell
# Navigate to server directory
cd server

# Run setup script
.\setup.ps1

# Or manually install
npm install
```

### Step 2: Start Backend Server

```powershell
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Database initialized
```

### Step 3: Test the Server (Optional)

In a new PowerShell window:

```powershell
cd server
.\test-server.ps1
```

### Step 4: Start Frontend

In a new PowerShell window:

```powershell
# From project root
npm run dev
```

Frontend will be at: `http://localhost:5173`

## Common Issues & Solutions

### Issue: "Cannot find module" errors

**Solution:**
```powershell
cd server
npm install
```

### Issue: Port 3001 already in use

**Solution:**
1. Find what's using the port:
```powershell
netstat -ano | findstr :3001
```

2. Kill the process or change port in `server/.env`:
```
PORT=3002
```

### Issue: Puppeteer fails to launch

**Solution:**
Puppeteer should work on Windows if Chrome is installed. If not:
1. Install Chrome from https://www.google.com/chrome/
2. Or set Puppeteer to use system Chrome:
```javascript
// In server/services/scraper.js, update puppeteer.launch:
browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})
```

### Issue: Database errors

**Solution:**
```powershell
# Ensure data directory exists
cd server
New-Item -ItemType Directory -Path "data" -Force
```

### Issue: CORS errors in browser

**Solution:**
1. Ensure backend is running on `http://localhost:3001`
2. Check frontend `.env` has:
```
VITE_API_URL=http://localhost:3001
```

## Verification Checklist

- [ ] Backend server starts without errors
- [ ] Health check works: `http://localhost:3001/api/health`
- [ ] Frontend connects to backend
- [ ] Search queries return results
- [ ] Email saving works

## Need Help?

1. Check `SETUP.md` for detailed troubleshooting
2. Check `README_BACKEND.md` for API documentation
3. Check browser console (F12) for frontend errors
4. Check backend terminal for server errors






