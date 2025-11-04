-- Migration: 002_create_orders_table
-- Description: Creates the orders and related tables for order management
-- Created: November 4, 2025

-- Create enum for order status
CREATE TYPE order_status AS ENUM (
  'pending',
  'processing',
  'confirmed',
  'failed',
  'cancelled',
  'refunded'
);

-- Create enum for order type
CREATE TYPE order_type AS ENUM (
  'purchase',
  'rental',
  'deposit'
);

-- Create orders table
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,  -- Using nanoid
  customer_id VARCHAR(255),     -- Reference to customer in auth system
  stripe_customer_id VARCHAR(255),
  type order_type NOT NULL DEFAULT 'purchase',
  status order_status NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL, -- Amount in cents
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  metadata JSONB,               -- Flexible metadata storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) REFERENCES orders(id),
  product_id VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,  -- Price in cents
  total_price INTEGER NOT NULL, -- Price in cents
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create rental deposits table
CREATE TABLE rental_deposits (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) REFERENCES orders(id),
  amount INTEGER NOT NULL,      -- Amount in cents
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  returned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create saved carts table for one-click reorder
CREATE TABLE saved_carts (
  id VARCHAR(255) PRIMARY KEY,  -- Using nanoid
  customer_id VARCHAR(255) NOT NULL,
  items JSONB NOT NULL,        -- Stored as JSON for flexibility
  name VARCHAR(255),           -- Optional cart name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_rental_deposits_order ON rental_deposits(order_id);
CREATE INDEX idx_saved_carts_customer ON saved_carts(customer_id);

-- Add triggers for updated_at
CREATE TRIGGER update_orders_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_rental_deposits_timestamp
  BEFORE UPDATE ON rental_deposits
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_saved_carts_timestamp
  BEFORE UPDATE ON saved_carts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();