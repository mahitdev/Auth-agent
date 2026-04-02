import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Initialize the database in the root directory
const dbPath = path.join(process.cwd(), 'openclaw.db');

// Ensure directory exists if we put it in a subdirectory, but here it's root
const db = new Database(dbPath, { verbose: console.log });

// Create interactions table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    metadata TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Interaction {
  id?: number;
  user_prompt: string;
  ai_response: string;
  metadata?: string;
  timestamp?: string;
}

export const saveInteraction = (prompt: string, response: string, metadata?: Record<string, any>) => {
  const stmt = db.prepare('INSERT INTO interactions (user_prompt, ai_response, metadata) VALUES (?, ?, ?)');
  const info = stmt.run(prompt, response, metadata ? JSON.stringify(metadata) : null);
  return info.lastInsertRowid;
};

export const getHistory = (): Interaction[] => {
  const stmt = db.prepare('SELECT * FROM interactions ORDER BY timestamp DESC LIMIT 50');
  return stmt.all() as Interaction[];
};

export default db;
