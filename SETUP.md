# Setup Guide

Complete setup instructions for the Healthcare AI Assistant application.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Chrome/Chromium** (for backend web scraping with Puppeteer)

## Step-by-Step Setup

### 1. Clone or Navigate to Project

```bash
cd Dem
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Create environment file (optional)
cp .env.example .env

# Start frontend development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 3. Backend Setup

Open a new terminal window:

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create environment file (optional)
cp .env.example .env

# Start backend server
npm run dev
```

Backend will be available at: `http://localhost:3001`

### 4. Verify Setup

1. Open `http://localhost:5173` in your browser
2. Check browser console for any errors
3. Try asking a healthcare question (e.g., "What is RCM?")
4. The system should:
   - Search billingparadise.com
   - Display results with URLs
   - Show related articles in the right panel

## Troubleshooting

### Backend Won't Start

**Issue**: Puppeteer installation fails
```bash
# On Linux
sudo apt-get install -y chromium-browser

# On macOS
brew install chromium

# On Windows
# Chrome should be installed automatically
```

**Issue**: Port 3001 already in use
```bash
# Change port in server/.env
PORT=3002
```

### Frontend Can't Connect to Backend

**Issue**: CORS errors or connection refused
- Ensure backend is running on `http://localhost:3001`
- Check `VITE_API_URL` in frontend `.env` file
- Verify backend CORS is enabled

### Database Issues

**Issue**: Database file not created
- Ensure `server/data/` directory exists
- Check file permissions
- Verify SQLite is installed

### Web Scraping Not Working

**Issue**: No results from billingparadise.com
- Check internet connection
- Verify billingparadise.com is accessible
- Check browser console for errors
- System will fallback to mock results if scraping fails

## Development Workflow

1. **Start Backend First**: Always start the backend server before the frontend
2. **Check Logs**: Monitor both terminal windows for errors
3. **Database Location**: Database file is at `server/data/healthcare.db`
4. **Hot Reload**: Both frontend and backend support hot reload during development

## Production Deployment

### Frontend Build

```bash
npm run build
```

Built files will be in `dist/` directory.

### Backend Production

```bash
cd server
npm start
```

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_URL=https://your-backend-domain.com
```

**Backend** (`server/.env`):
```
PORT=3001
NODE_ENV=production
```

## Next Steps

- Read [README.md](./README.md) for feature overview
- Read [README_BACKEND.md](./README_BACKEND.md) for backend details
- Customize the application for your needs

