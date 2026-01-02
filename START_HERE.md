# Quick Start - Single Server

## Setup (One-time)

1. **Create `.env` file** in the `server` folder:
   ```
   PORT=3001
   GEMINI_API_KEY=AIzaSyCIntyvXw8Uc-pFwtqet-PnoumwC3Mwrik
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

## Running the Application

**Just run ONE command:**
```bash
npm start
```

This will:
- ✅ Serve your React app
- ✅ Run the Express backend with Gemini API
- ✅ Everything on ONE server at `http://localhost:3001`

Open your browser to `http://localhost:3001` and start chatting!

## Development Mode

If you make changes to the frontend:
```bash
npm run dev
```

This will rebuild the frontend and start the server.

## How It Works

- The Express server serves the built React files from the `dist` folder
- All API calls go to `/api/*` routes
- Everything else serves the React app
- **ONE server, ONE port, ONE command!**

## Stopping the Application

Press `Ctrl+C` in the terminal.
