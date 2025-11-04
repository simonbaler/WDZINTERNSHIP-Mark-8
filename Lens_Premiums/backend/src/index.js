// Backend server setup
// Loading environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

// Creating the express app
const app = express();
const PORT = process.env.PORT || 3000;

// Setting up middleware
app.use(cors());
app.use(express.json());
console.log('Middleware setup complete'); // Debug log
// Auth routes
app.use('/api/auth', authRoutes);

// Sample products data (fallback if database connection fails)
const sampleProducts = [
  {
    id: 1,
    name: "Professional DSLR Camera",
    description: "High-end DSLR with 24.2MP sensor and 4K video recording",
    price: 1299.99,
    imageUrl: "/placeholder.svg",
    category: "cameras",
    stock: 15
  },
  {
    id: 2,
    name: "Ultra-Wide Lens",
    description: "Professional 16-35mm f/2.8 ultra-wide zoom lens",
    price: 899.99,
    imageUrl: "/placeholder.svg",
    category: "lenses",
    stock: 8
  },
  {
    id: 3,
    name: "Camera Tripod",
    description: "Sturdy carbon fiber tripod with ball head",
    price: 199.99,
    imageUrl: "/placeholder.svg",
    category: "accessories",
    stock: 20
  }
];

// In-memory products data
const products = [
  // Cameras
  {
    id: 1,
    name: "Canon EOS R5",
    description: "Professional mirrorless camera with 45MP sensor and 8K video recording",
    price: 3899.99,
    imageUrl: "/images/canon-eos-r5.jpg",
    category: "cameras",
    subcategory: "mirrorless",
    stock: 10
  },
  {
    id: 2,
    name: "Nikon Z9",
    description: "Flagship mirrorless camera with 45.7MP sensor and advanced autofocus",
    price: 5499.99,
    imageUrl: "/images/nikon-z9.jpg",
    category: "cameras",
    subcategory: "mirrorless",
    stock: 8
  },
  {
    id: 3,
    name: "Sony A7 IV",
    description: "Full-frame mirrorless camera with 33MP sensor and 4K60p video",
    price: 2499.99,
    imageUrl: "/images/sony-a7iv.jpg",
    category: "cameras",
    subcategory: "mirrorless",
    stock: 15
  },
  {
    id: 4,
    name: "Canon EOS 5D Mark IV",
    description: "Professional DSLR with 30.4MP sensor and 4K video recording",
    price: 2499.99,
    imageUrl: "/images/canon-5d-mark-iv.jpg",
    category: "cameras",
    subcategory: "dslr",
    stock: 12
  },
  {
    id: 5,
    name: "Nikon D850",
    description: "High-resolution DSLR with 45.7MP sensor and excellent dynamic range",
    price: 2999.99,
    imageUrl: "/images/nikon-d850.jpg",
    category: "cameras",
    subcategory: "dslr",
    stock: 9
  },
  
  // Lenses
  {
    id: 6,
    name: "Canon RF 24-70mm f/2.8L IS USM",
    description: "Professional standard zoom lens for Canon RF mount",
    price: 2399.99,
    imageUrl: "/images/canon-rf-24-70.jpg",
    category: "lenses",
    subcategory: "zoom",
    stock: 14
  },
  {
    id: 7,
    name: "Nikon Z 50mm f/1.8 S",
    description: "Sharp standard prime lens for Nikon Z mount",
    price: 599.99,
    imageUrl: "/images/nikon-z-50mm.jpg",
    category: "lenses",
    subcategory: "prime",
    stock: 20
  },
  {
    id: 8,
    name: "Sony FE 16-35mm f/2.8 GM",
    description: "Professional ultra-wide zoom lens for Sony E-mount",
    price: 2199.99,
    imageUrl: "/images/sony-16-35-gm.jpg",
    category: "lenses",
    subcategory: "wide-angle",
    stock: 11
  },
  {
    id: 9,
    name: "Canon RF 70-200mm f/2.8L IS USM",
    description: "Professional telephoto zoom lens for Canon RF mount",
    price: 2699.99,
    imageUrl: "/images/canon-rf-70-200.jpg",
    category: "lenses",
    subcategory: "telephoto",
    stock: 8
  },
  {
    id: 10,
    name: "Sigma 85mm f/1.4 DG DN Art",
    description: "Sharp portrait prime lens for mirrorless cameras",
    price: 1199.99,
    imageUrl: "/images/sigma-85mm.jpg",
    category: "lenses",
    subcategory: "portrait",
    stock: 15
  },
  
  // Accessories
  {
    id: 11,
    name: "Manfrotto MT055XPRO3 Tripod",
    description: "Professional aluminum tripod with 3-section legs",
    price: 279.99,
    imageUrl: "/images/manfrotto-tripod.jpg",
    category: "accessories",
    subcategory: "tripods",
    stock: 25
  },
  {
    id: 12,
    name: "Godox AD200Pro Flash",
    description: "Portable off-camera flash with 200Ws output",
    price: 349.99,
    imageUrl: "/images/godox-ad200.jpg",
    category: "accessories",
    subcategory: "lighting",
    stock: 18
  },
  {
    id: 13,
    name: "Peak Design Everyday Backpack",
    description: "Versatile camera backpack with customizable dividers",
    price: 259.99,
    imageUrl: "/images/peak-design-backpack.jpg",
    category: "accessories",
    subcategory: "bags",
    stock: 22
  },
  {
    id: 14,
    name: "DJI RS 3 Pro Gimbal",
    description: "Professional 3-axis gimbal stabilizer for cameras",
    price: 869.99,
    imageUrl: "/images/dji-rs3-pro.jpg",
    category: "accessories",
    subcategory: "stabilizers",
    stock: 10
  },
  {
    id: 15,
    name: "SanDisk Extreme PRO 128GB SD Card",
    description: "High-speed SD card with 170MB/s read and 90MB/s write speeds",
    price: 49.99,
    imageUrl: "/images/sandisk-sd-card.jpg",
    category: "accessories",
    subcategory: "memory",
    stock: 35
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Camera Glaze API' });
});

// Product routes with in-memory data
app.get('/api/products', (req, res) => {
  console.log('Getting all products'); // Debug log
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Getting product with id: ${id}`); // Debug log
  const product = products.find(p => p.id === id);

  if (!product) {
    console.log('Product not found'); // Debug log
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, description, price, imageUrl, category, stock } = req.body;
  
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    description,
    price,
    imageUrl,
    category,
    stock
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  const { name, description, price, imageUrl, category, stock } = req.body;
  
  products[index] = {
    ...products[index],
    name,
    description,
    price,
    imageUrl,
    category,
    stock
  };
  
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  products.splice(index, 1);
  res.status(200).json({ message: 'Product deleted successfully' });
});

// Health check endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Using in-memory data store');
});