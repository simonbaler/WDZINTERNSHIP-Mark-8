const express = require('express');
const router = express.Router();

// Basic order routes
router.get('/', (req, res) => {
  res.json({ message: 'Order API is working' });
});

module.exports = router;