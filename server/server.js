import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import { searchBillingParadise } from './services/scraper.js'
import { initDatabase, saveUserEmail, getUserByEmail, saveSearchHistory } from './services/database.js'
import { generateOllamaResponse } from './services/ollamaService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Apply rate limiting to all requests
app.use(limiter)

// CORS - Allow all origins since frontend is served from same server
app.use(cors())

app.use(express.json())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')))

// Initialize database
initDatabase().catch(err => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Healthcare AI Backend is running' })
})

// Web search endpoint for billingparadise.com
app.post('/api/search', async (req, res) => {
  try {
    const { query, userId } = req.body

    // Validation
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required and must be a string' })
    }

    if (query.length > 500) {
      return res.status(400).json({ error: 'Query is too long (max 500 chars)' })
    }

    console.log(`Searching billingparadise.com for: ${query}`)

    const results = await searchBillingParadise(query)

    // Save search history if userId is provided
    if (userId) {
      saveSearchHistory(userId, query, results ? 1 : 0)
    }

    res.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({
      error: 'Failed to search billingparadise.com',
      message: error.message
    })
  }
})

// Ollama AI generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { message, category, history, searchContext } = req.body

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' })
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message is too long (max 1000 chars)' })
    }

    console.log(`Generating AI response for: ${message}`)

    const result = await generateOllamaResponse(
      message,
      category || 'General Healthcare Knowledge',
      history || [],
      searchContext || null
    )

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Ollama generation error:', error)
    res.status(500).json({
      error: 'Failed to generate AI response',
      message: error.message
    })
  }
})

// Save user email endpoint
app.post('/api/users/email', async (req, res) => {
  try {
    const { email } = req.body

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const user = await saveUserEmail(email)

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Save email error:', error)
    res.status(500).json({
      error: 'Failed to save email',
      message: error.message
    })
  }
})

// Get user by email endpoint
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const { email } = req.params

    // Basic validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const user = await getUserByEmail(email)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message
    })
  }
})

// Catch-all route - serve React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Database initialized`)
  console.log(`🤖 Using Ollama AI at http://localhost:11434`)
})
