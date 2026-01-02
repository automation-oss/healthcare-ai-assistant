import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize database
let db

export function initDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Ensure data directory exists
      const dataDir = path.join(__dirname, '../data')
      try {
        mkdirSync(dataDir, { recursive: true })
      } catch (err) {
        // Directory might already exist, ignore error
      }

      db = new sqlite3.Database(path.join(dataDir, 'healthcare.db'), (err) => {
        if (err) {
          console.error('❌ Database connection error:', err)
          reject(err)
          return
        }

        console.log('✅ Connected to SQLite database')

        db.serialize(() => {
          // Create users table
          db.run(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT UNIQUE NOT NULL,
              name TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `)

          // Create search_history table
          db.run(`
            CREATE TABLE IF NOT EXISTS search_history (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              query TEXT NOT NULL,
              results_count INTEGER,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id)
            )
          `, (err) => {
            if (err) {
              console.error('❌ Database initialization error:', err)
              reject(err)
            } else {
              console.log('✅ Database initialized successfully')
              resolve()
            }
          })
        })
      })
    } catch (error) {
      console.error('❌ Database setup error:', error)
      reject(error)
    }
  })
}

export function saveUserEmail(email) {
  return new Promise((resolve, reject) => {
    const name = email.split('@')[0]

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err)
        return
      }

      if (row) {
        db.run('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE email = ?', [email], function (err) {
          if (err) reject(err)
          else resolve(row)
        })
      } else {
        db.run('INSERT INTO users (email, name) VALUES (?, ?)', [email, name], function (err) {
          if (err) {
            reject(err)
            return
          }

          db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
            if (err) reject(err)
            else resolve(newUser)
          })
        })
      }
    })
  })
}

export function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err)
      else resolve(row || null)
    })
  })
}

export function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err)
      else resolve(row || null)
    })
  })
}

export function saveSearchHistory(userId, query, resultsCount) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO search_history (user_id, query, results_count) VALUES (?, ?, ?)',
      [userId, query, resultsCount],
      (err) => {
        if (err) {
          console.error('Error saving search history:', err)
          // Don't reject, just log
          resolve()
        } else {
          resolve()
        }
      }
    )
  })
}

export function getDatabase() {
  return db
}
