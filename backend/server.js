// Import necessary packages
const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database connection variable
let db;

// Function to connect to the MySQL database
async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log('Connected to MySQL database');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Configure file uploads with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 }
});

// --- API Routes ---

// Route to register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, phone_number } = req.body;

    // Check if the user already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create a new user in the database
    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash, full_name, phone_number) VALUES (?, ?, ?, ?)',
      [email, password_hash, full_name, phone_number]
    );

    // Create a user profile
    await db.execute(
      'INSERT INTO profiles (user_id, full_name, phone_number) VALUES (?, ?, ?)',
      [result.insertId, full_name, phone_number]
    );

    // Assign the 'customer' role to the new user
    await db.execute(
      'INSERT INTO user_roles (user_id, role) VALUES (?, ?)',
      [result.insertId, 'customer']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Route to log in a user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password is valid
    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Route to get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Route to get all products with optional filtering
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    let query = 'SELECT * FROM products WHERE is_active = true';
    let params = [];

    if (category) {
      query += ' AND category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.execute(query, params);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Route to get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ? AND is_active = true', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Route to get orders for the authenticated user
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Route to create a new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, shipping_address, payment_method } = req.body;

    // Calculate the total order amount
    let total = 0;
    for (const item of items) {
      const [products] = await db.execute('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length === 0) {
        return res.status(400).json({ error: `Product ${item.product_id} not found` });
      }
      total += products[0].price * item.quantity;
    }

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create the order in the database
    const [orderResult] = await db.execute(
      'INSERT INTO orders (user_id, order_number, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, orderNumber, total, JSON.stringify(shipping_address), payment_method]
    );

    // Create the order items
    for (const item of items) {
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.product_id, item.quantity, item.price]
      );
    }

    res.status(201).json({ orderId: orderResult.insertId, orderNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Route to upload a media file
app.post('/api/media/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, filename, size, mimetype } = req.file;
    const mediaType = mimetype.startsWith('image/') ? 'image' :
                     mimetype === 'model/gltf-binary' ? 'glb' : 'document';

    // Save media information to the database
    const [result] = await db.execute(
      'INSERT INTO media (user_id, filename, original_filename, mime_type, file_size, storage_path, media_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, filename, originalname, mimetype, size, req.file.path, mediaType]
    );

    res.status(201).json({
      id: result.insertId,
      filename,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Route to get all active feature flags
app.get('/api/feature-flags', async (req, res) => {
  try {
    const [flags] = await db.execute('SELECT flag_key, flag_value FROM feature_flags WHERE is_active = true');
    const flagsObj = {};
    flags.forEach(flag => {
      flagsObj[flag.flag_key] = flag.flag_value;
    });
    res.json(flagsObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch feature flags' });
  }
});

// Health check route to verify server status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Function to start the server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Start the server
startServer().catch(console.error);
