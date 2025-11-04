/**
 * Stripe Payment Service
 * 
 * Handles all payment-related operations using Stripe including:
 * - Creating checkout sessions
 * - Managing payment intents
 * - Processing webhooks
 * - Handling rental deposits
 * 
 * Important: This service requires Stripe API keys to be set in environment variables:
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { nanoid } = require('nanoid');
const { logger } = require('../utils/logger');

class StripeService {
  async createCheckoutSession(orderData, customerId) {
    const idempotencyKey = nanoid();
    
    return stripe.checkout.sessions.create({
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      mode: 'payment',
      customer: customerId,
      line_items: orderData.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image]
          },
          unit_amount: item.price * 100 // Convert to cents
        },
        quantity: item.quantity
      })),
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
    }, {
      idempotencyKey
    });
  }

  async createPaymentIntent(orderData, customerId) {
    const idempotencyKey = nanoid();
    
    return stripe.paymentIntents.create({
      amount: orderData.total * 100,
      currency: 'usd',
      customer: customerId,
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      metadata: {
        orderId: orderData.id
      }
    }, {
      idempotencyKey
    });
  }

  async handleWebhook(rawBody, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        // Add more event handlers as needed
      }
      
      return { received: true };
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }

  async handleCheckoutCompleted(session) {
    // Implement order completion logic
  }

  async handlePaymentSucceeded(paymentIntent) {
    // Implement payment success logic
  }
}

module.exports = new StripeService();