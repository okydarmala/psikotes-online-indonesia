const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const DB_PATH = path.join(process.cwd(), 'data', 'psikotes.db');

let db = null;

function getDB() {
  if (!db) {
    // Create data directory if it doesn't exist
    const fs = require('fs');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('SQLite connection error:', err.message);
      } else {
        console.log('✓ Connected to SQLite database at:', DB_PATH);
      }
    });

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}

async function query(sql, values = []) {
  return new Promise((resolve, reject) => {
    const database = getDB();
    
    // Replace MySQL ? placeholders with ? for SQLite (they're the same)
    const sqlite_sql = sql;
    
    if (sql.includes('INSERT') || sql.includes('UPDATE') || sql.includes('DELETE')) {
      database.run(sqlite_sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            lastID: this.lastID,
            changes: this.changes,
          });
        }
      });
    } else {
      database.all(sqlite_sql, values, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    }
  });
}

async function executeTransaction(callback) {
  const database = getDB();
  
  return new Promise((resolve, reject) => {
    database.serialize(async () => {
      database.run('BEGIN TRANSACTION', async (err) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const result = await callback({
            run: (sql, values) => query(sql, values),
          });
          
          database.run('COMMIT', (err) => {
            if (err) reject(err);
            else resolve(result);
          });
        } catch (error) {
          database.run('ROLLBACK', () => {
            reject(error);
          });
        }
      });
    });
  });
}

function closeDB() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
    db = null;
  }
}

module.exports = {
  getDB,
  query,
  executeTransaction,
  closeDB,
};
