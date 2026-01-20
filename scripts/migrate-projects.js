/**
 * Migration script: Move projects from data.json to database
 * Run with: node scripts/migrate-projects.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Paths
const dbPath = path.join(__dirname, '..', 'data', 'blog.db');
const dataPath = path.join(__dirname, '..', 'data.json');

// Read data.json
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const projects = data.projects || [];

console.log(`Found ${projects.length} projects in data.json`);

// Initialize database
const db = new Database(dbPath);

// Create projects table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'running',
    date TEXT NOT NULL,
    url TEXT NOT NULL,
    live TEXT,
    description TEXT NOT NULL,
    features TEXT,
    repos TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepare insert statement
const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO projects (id, name, status, date, url, live, description, features, repos)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let migrated = 0;
let skipped = 0;

for (const project of projects) {
  try {
    insertStmt.run(
      project.id,
      project.name,
      project.status || 'running',
      project.date,
      project.url,
      project.live ?? null,
      project.description,
      project.features ? JSON.stringify(project.features) : null,
      project.repos ? JSON.stringify(project.repos) : null
    );
    migrated++;
    console.log(`✓ Migrated: ${project.name} (${project.id})`);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      skipped++;
      console.log(`- Skipped (already exists): ${project.name} (${project.id})`);
    } else {
      console.error(`✗ Error migrating ${project.name}:`, error.message);
    }
  }
}

db.close();

console.log(`\nMigration complete: ${migrated} migrated, ${skipped} skipped`);
console.log('\nYou can now manage projects in the admin panel at /admin/projects');
