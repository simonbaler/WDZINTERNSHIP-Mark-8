/**
 * Checkout API Routes
 * 
 * This module handles all checkout-related API endpoints including:
 * - Creating checkout sessions
 * - Processing payments
 * - Managing rental deposits
 * - Handling one-click reorders
 * 
 * Security Considerations:
 * - All routes should verify authentication
 * - Validate idempotency keys
 * - Check inventory before processing
 * - Verify webhook signatures
 */

const express = require('express');
const router = express.Router();
const stripeService = require('../services/StripeService');
const inventoryService = require('../services/InventoryService');
const { nanoid } = require('nanoid');
const { logger } = require('../utils/logger');

// Middleware to ensure authenticated requests
const requireAuth = require('../middleware/requireAuth');

// Initialize checkout session
router.post('/checkout', async (req, res) => {
  const { items, orderType } = req.body;
  const orderId = nanoid();
  
  try {
    // Reserve inventory first
    await inventoryService.reserveInventory(items, orderId);
    
    // Create order in database
    // ... implement order creation logic
    
    // Create Stripe checkout session
    const session = await stripeService.createCheckoutSession({
      id: orderId,
      items,
      orderType
    }, req.user?.stripeCustomerId);
    
    res.json({ sessionId: session.id });
  } catch (error) {
    // Release inventory if checkout fails
    await inventoryService.releaseInventory(items);
    res.status(400).json({ error: error.message });
  }
});

// Handle Stripe webhooks
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const result = await stripeService.handleWebhook(req.body, sig);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Initialize rental/deposit flow
router.post('/checkout/rental', async (req, res) => {
  const { items, depositAmount } = req.body;
  const orderId = nanoid();
  
  try {
    await inventoryService.reserveInventory(items, orderId);
    
    // Create rental order with deposit
    // ... implement rental order creation logic
    
    const paymentIntent = await stripeService.createPaymentIntent({
      id: orderId,
      total: depositAmount,
      type: 'rental_deposit'
    }, req.user?.stripeCustomerId);
    
    res.json({ 
      clientSecret: paymentIntent.client_secret,
      orderId 
    });
  } catch (error) {
    await inventoryService.releaseInventory(items);
    res.status(400).json({ error: error.message });
  }
});

// One-click reorder
router.post('/reorder/:orderId', async (req, res) => {
  const { orderId } = req.params;
  
  try {
    // Fetch original order
    // ... implement order fetching logic
    
    // Check inventory and create new order
    // ... implement reorder logic
    
    const session = await stripeService.createCheckoutSession({
      id: nanoid(),
      items: order.items
    }, req.user?.stripeCustomerId);
    
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;