/**
 * Constants and Configuration
 * 
 * This file contains all the configuration constants used throughout
 * the application. Centralizing these values makes it easier to
 * maintain and modify them.
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3004',
  TIMEOUT: 30000, // 30 seconds
};

// Stripe Configuration
export const STRIPE_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  PAYMENT_METHODS: ['card', 'apple_pay', 'google_pay'],
};

// Checkout Configuration
export const CHECKOUT_CONFIG = {
  MIN_ORDER_AMOUNT: 100, // $1.00
  MAX_ORDER_AMOUNT: 1000000, // $10,000.00
  RENTAL_DEPOSIT_PERCENTAGE: 20, // 20% of total
  RENTAL_MIN_DAYS: 1,
  RENTAL_MAX_DAYS: 30,
  LATE_FEE_PER_DAY: 5000, // $50.00
};

// Inventory Configuration
export const INVENTORY_CONFIG = {
  LOW_STOCK_THRESHOLD: 5,
  RESERVE_TIMEOUT: 15 * 60, // 15 minutes in seconds
};

// Error Messages
export const ERROR_MESSAGES = {
  CHECKOUT: {
    INVALID_AMOUNT: 'Invalid order amount',
    PAYMENT_FAILED: 'Payment processing failed',
    INVENTORY_UNAVAILABLE: 'One or more items are out of stock',
    SESSION_EXPIRED: 'Checkout session expired',
  },
  RENTAL: {
    INVALID_DATES: 'Invalid rental dates selected',
    DEPOSIT_REQUIRED: 'Deposit payment is required',
    RENTAL_TOO_LONG: `Rental period cannot exceed ${CHECKOUT_CONFIG.RENTAL_MAX_DAYS} days`,
  },
};

// Route Configuration
export const ROUTES = {
  CHECKOUT: {
    SUCCESS: '/checkout/success',
    CANCEL: '/checkout/cancel',
    COMPLETE: '/checkout/complete',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
};