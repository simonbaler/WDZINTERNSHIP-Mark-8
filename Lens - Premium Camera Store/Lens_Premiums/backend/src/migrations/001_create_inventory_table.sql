-- Migration: 001_create_inventory_table
-- Description: Creates the inventory table for tracking product stock
-- Created: November 4, 2025

-- Create enum for product status
CREATE TYPE product_status AS ENUM (
  'in_stock',
  'low_stock',
  'out_of_stock',
  'discontinued'
);

-- Create inventory table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  status product_status NOT NULL DEFAULT 'in_stock',
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure quantities can't be negative
  CONSTRAINT non_negative_quantity CHECK (quantity >= 0),
  CONSTRAINT non_negative_reserved CHECK (reserved_quantity >= 0)
);

-- Create index for faster lookups
CREATE INDEX idx_inventory_product_id ON inventory(product_id);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update timestamp
CREATE TRIGGER update_inventory_timestamp
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();