-- MySQL Schema converted from Supabase migrations
-- Note: UUIDs are converted to VARCHAR(36), auth.users replaced with users table
-- RLS policies need to be implemented in application logic

-- Create database
CREATE DATABASE IF NOT EXISTS camera_store;
USE camera_store;

-- Users table (replaces auth.users)
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone_number VARCHAR(20),
  email_confirmed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE profiles (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  phone_number VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User roles enum
CREATE TABLE user_roles (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories table
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Products table
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category_id VARCHAR(36),
  brand VARCHAR(100),
  stock INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  images JSON DEFAULT ('[]'),
  specifications JSON DEFAULT ('{}'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders table
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSON NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Reviews table
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  product_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, user_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Coupons table
CREATE TABLE coupons (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  usage_limit INT,
  usage_count INT DEFAULT 0,
  valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media table
CREATE TABLE media (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  cdn_url VARCHAR(500),
  media_type ENUM('image', 'glb', 'usdz', 'video', 'document') NOT NULL,
  processing_status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  width INT,
  height INT,
  polycount INT,
  draco_compressed BOOLEAN DEFAULT FALSE,
  lod_levels JSON DEFAULT ('[]'),
  variants JSON DEFAULT ('{}'),
  product_id VARCHAR(36),
  metadata JSON DEFAULT ('{}'),
  tags JSON,
  alt_text VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Media processing queue
CREATE TABLE media_processing_queue (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  media_id VARCHAR(36) NOT NULL,
  job_type ENUM('image_optimize', 'glb_compress', 'lod_generate', 'usdz_convert', 'thumbnail_generate') NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  priority INT DEFAULT 5,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  error_message TEXT,
  result JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- Product embeddings (simplified, no vector extension in MySQL)
CREATE TABLE product_embeddings (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  product_id VARCHAR(36) NOT NULL,
  embedding_type ENUM('text', 'image', 'combined') NOT NULL,
  embedding TEXT, -- Store as JSON array or base64
  content_hash VARCHAR(64),
  source_field VARCHAR(50),
  metadata JSON DEFAULT ('{}'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(product_id, embedding_type, source_field),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Search history
CREATE TABLE search_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36),
  search_query TEXT NOT NULL,
  search_type ENUM('text', 'image', 'semantic', 'visual') NOT NULL,
  results_count INT DEFAULT 0,
  metadata JSON DEFAULT ('{}'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Feature flags
CREATE TABLE feature_flags (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  flag_key VARCHAR(100) UNIQUE NOT NULL,
  flag_value JSON NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Webhook configs
CREATE TABLE webhook_configs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  secret VARCHAR(255),
  events JSON NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Webhook events
CREATE TABLE webhook_events (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  webhook_config_id VARCHAR(36) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  payload JSON NOT NULL,
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  attempts INT DEFAULT 0,
  last_attempt_at TIMESTAMP NULL,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (webhook_config_id) REFERENCES webhook_configs(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_coupons_code ON coupons(code) WHERE is_active = TRUE;
CREATE INDEX idx_media_product_id ON media(product_id);
CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_media_type ON media(media_type);
CREATE INDEX idx_product_embeddings_product_id ON product_embeddings(product_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);

-- Insert default feature flags
INSERT INTO feature_flags (flag_key, flag_value) VALUES
('edge_personalization', '{"enabled": false}'),
('ar_showroom', '{"enabled": true}'),
('federated_learning', '{"enabled": false}'),
('webauthn_payments', '{"enabled": false}'),
('provenance_ledger', '{"enabled": false}');
