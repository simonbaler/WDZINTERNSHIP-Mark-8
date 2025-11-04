/**
 * Database Migration Runner
 * 
 * This script runs all SQL migrations in order to set up or update
 * the database schema. It tracks applied migrations to ensure
 * they only run once.
 * 
 * Usage:
 * node migrate.js
 * 
 * Environment variables required:
 * - DATABASE_URL: PostgreSQL connection string
 */

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
const { logger } = require('../utils/logger');

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createMigrationsTable() {
  const client = await pool.connect();
  try {
    // Create table to track migrations if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    client.release();
  }
}

async function getAppliedMigrations() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT name FROM migrations ORDER BY id'
    );
    return result.rows.map(row => row.name);
  } finally {
    client.release();
  }
}

async function runMigration(client, migrationPath) {
  const sql = await fs.readFile(migrationPath, 'utf-8');
  await client.query(sql);
}

async function migrate() {
  logger.info('Starting database migration');
  
  const client = await pool.connect();
  try {
    // Ensure migrations table exists
    await createMigrationsTable();
    
    // Get list of applied migrations
    const appliedMigrations = await getAppliedMigrations();
    
    // Get all migration files
    const migrationFiles = await fs.readdir(__dirname);
    const pendingMigrations = migrationFiles
      .filter(f => f.endsWith('.sql'))
      .filter(f => !appliedMigrations.includes(f))
      .sort();
    
    if (pendingMigrations.length === 0) {
      logger.info('No pending migrations');
      return;
    }
    
    // Run pending migrations in transaction
    await client.query('BEGIN');
    
    for (const migration of pendingMigrations) {
      try {
        logger.info(`Running migration: ${migration}`);
        await runMigration(client, path.join(__dirname, migration));
        
        // Record successful migration
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [migration]
        );
        
        logger.info(`Completed migration: ${migration}`);
      } catch (error) {
        logger.error(`Migration failed: ${migration}`);
        logger.error(error);
        await client.query('ROLLBACK');
        throw error;
      }
    }
    
    await client.query('COMMIT');
    logger.info('All migrations completed successfully');
    
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migrations if this file is run directly
if (require.main === module) {
  migrate().catch(error => {
    logger.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = { migrate };