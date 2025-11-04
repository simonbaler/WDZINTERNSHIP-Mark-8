/**
 * Inventory Management Service
 * 
 * This service handles all inventory-related operations including:
 * - Atomic inventory reservations using Redis locks
 * - Database transactions with PostgreSQL
 * - Rental and deposit management
 * 
 * Author: [Your Name]
 * Created: November 4, 2025
 */

const Redis = require('ioredis');
const { Pool } = require('pg');
const { logger } = require('../utils/logger');

// Initialize Redis and PostgreSQL connections
const redis = new Redis(process.env.REDIS_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class InventoryService {
  async reserveInventory(items, orderId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const item of items) {
        // Try to acquire Redis lock first
        const lockKey = `inventory:lock:${item.id}`;
        const locked = await redis.set(lockKey, orderId, 'NX', 'EX', 60); // 60s lock
        
        if (!locked) {
          throw new Error(`Item ${item.id} is currently being processed`);
        }
        
        // Check and update inventory with row lock
        const result = await client.query(
          'SELECT quantity FROM inventory WHERE id = $1 FOR UPDATE',
          [item.id]
        );
        
        if (!result.rows[0] || result.rows[0].quantity < item.quantity) {
          throw new Error(`Insufficient inventory for item ${item.id}`);
        }
        
        await client.query(
          'UPDATE inventory SET quantity = quantity - $1 WHERE id = $2',
          [item.quantity, item.id]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
      // Release Redis locks
      for (const item of items) {
        await redis.del(`inventory:lock:${item.id}`);
      }
    }
  }

  async releaseInventory(items) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const item of items) {
        await client.query(
          'UPDATE inventory SET quantity = quantity + $1 WHERE id = $2',
          [item.quantity, item.id]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async handleRentalDeposit(orderId, action) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      if (action === 'hold') {
        await client.query(
          'UPDATE orders SET deposit_status = $1 WHERE id = $2',
          ['held', orderId]
        );
      } else if (action === 'capture') {
        await client.query(
          'UPDATE orders SET deposit_status = $1 WHERE id = $2',
          ['captured', orderId]
        );
      } else if (action === 'release') {
        await client.query(
          'UPDATE orders SET deposit_status = $1 WHERE id = $2',
          ['released', orderId]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new InventoryService();