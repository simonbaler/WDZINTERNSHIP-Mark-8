const { sequelize } = require('./db');
const Product = require('../models/Product');

// Sample product data
const sampleProducts = [
  {
    name: 'Canon EOS R5',
    description: 'Professional full-frame mirrorless camera with 45MP sensor and 8K video recording',
    price: 3899.99,
    imageUrl: '/images/canon-r5.jpg',
    category: 'Cameras',
    stock: 15
  },
  {
    name: 'Sony Alpha a7 III',
    description: 'Full-frame mirrorless camera with excellent low-light performance and 4K video',
    price: 1999.99,
    imageUrl: '/images/sony-a7iii.jpg',
    category: 'Cameras',
    stock: 20
  },
  {
    name: 'Nikon Z6 II',
    description: 'Versatile full-frame mirrorless camera with 24.5MP sensor and dual processors',
    price: 1999.95,
    imageUrl: '/images/nikon-z6ii.jpg',
    category: 'Cameras',
    stock: 12
  }
];

// Initialize database
const initDB = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Insert sample products
    await Product.bulkCreate(sampleProducts);
    console.log('Sample products inserted');
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

module.exports = initDB;