# Healthcare AI Assistant - Backend API

This repository now provides **two** backend options for MediAssist AI:

1. `py_backend/` – a LangChain-powered FastAPI service (recommended) that delivers AI responses using Python, embeddings, and retrieval-augmented generation.
2. `server/` – the original Node/Express service (web scraping + email storage) which you can keep for reference or incremental migration.

The sections below outline both stacks so you can choose the one that fits your deployment strategy.

---

## Python LangChain Backend (`py_backend/`)

### Features

- **FastAPI** service that mirrors the existing `/api/health` and `/api/generate` endpoints.
- **LangChain RAG pipeline** combining conversation history, category context, and retrieved knowledge-base snippets.
- **Embeddings + FAISS** for quick semantic lookups over Markdown knowledge files located in `py_backend/data/knowledge_base`.
- **Flexible LLM providers** – defaults to a local Ollama model but automatically switches to OpenAI if `OPENAI_API_KEY` is present.

### Setup

1. Create and activate a virtual environment (optional but recommended).
2. Install dependencies:

```bash
cd py_backend
pip install -r requirements.txt
```

3. (Optional) Configure environment variables via `.env`:

```env
PORT=8000
LLM_PROVIDER=ollama          # or openai
OLLAMA_MODEL=qwen2:0.5b
OPENAI_API_KEY=sk-...
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

4. Start the server:

```bash
uvicorn app.main:app --reload --port 8000
```

5. Point the React app to the Python backend by setting `VITE_API_URL=http://localhost:8000` in the frontend `.env`.

---

## Node.js Backend (`server/`)

## Features

- **Web Scraping**: Real-time web scraping of billingparadise.com using Puppeteer
- **Database Storage**: SQLite database for storing user emails and search history
- **CORS Enabled**: Configured to work with the frontend application
- **RESTful API**: Clean API endpoints for search and user management

## Setup

### Prerequisites

- Node.js 18+ and npm
- Chrome/Chromium (for Puppeteer)

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
cp .env.example .env
```

4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Web Search
```
POST /api/search
Content-Type: application/json

{
  "query": "rcm best practices"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "primaryUrl": "https://www.billingparadise.com/revenue-cycle-management/",
    "additionalUrls": [
      "https://www.billingparadise.com/rcm-best-practices/",
      "https://www.billingparadise.com/rcm-workflow-optimization/"
    ],
    "content": "Revenue Cycle Management (RCM) is crucial..."
  }
}
```

### Save User Email
```
POST /api/users/email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User by Email
```
GET /api/users/email/:email
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Database

The application uses SQLite for simplicity. The database file is created automatically at `server/data/healthcare.db`.

### Tables

**users**
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT UNIQUE)
- `name` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**search_history** (optional, for analytics)
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `query` (TEXT)
- `results_count` (INTEGER)
- `created_at` (DATETIME)

## Web Scraping

The scraper uses Puppeteer to:
1. Navigate to billingparadise.com search page
2. Extract article links and content
3. Return structured results

The scraper includes:
- Fallback mechanisms if scraping fails
- Error handling and retry logic
- Content extraction from search results

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=3001
NODE_ENV=development
```

## Frontend Integration

Update your frontend `.env` file to point to the backend:

```env
VITE_API_URL=http://localhost:3001
```

## Production Deployment

### Considerations

1. **Database**: Consider migrating from SQLite to PostgreSQL or MySQL for production
2. **Scraping**: Implement rate limiting and caching for web scraping
3. **Security**: Add authentication and rate limiting
4. **Monitoring**: Add logging and error tracking
5. **CORS**: Configure CORS properly for your production domain

### Database Migration

To use PostgreSQL instead of SQLite:

1. Install PostgreSQL driver:
```bash
npm install pg
```

2. Update `server/services/database.js` to use PostgreSQL connection
3. Update connection string in environment variables

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### Puppeteer Issues

If Puppeteer fails to launch:
- Ensure Chrome/Chromium is installed
- On Linux, you may need: `apt-get install -y chromium-browser`
- Check Puppeteer installation: `npm list puppeteer`

### CORS Issues

If you encounter CORS errors:
- Ensure the backend CORS middleware is configured
- Check that the frontend URL is allowed in CORS settings

### Database Issues

If database operations fail:
- Check file permissions for `server/data/` directory
- Ensure SQLite is properly installed
- Check database file exists: `server/data/healthcare.db`

## License

MIT License

