/**
 * Custom Error Classes
 * 
 * This module defines custom error classes for different types of errors
 * that can occur during the checkout process.
 */

/**
 * Base error class for checkout-related errors
 */
class CheckoutError extends Error {
  constructor(message, code = 'CHECKOUT_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

/**
 * Thrown when inventory is not available
 */
class InventoryError extends CheckoutError {
  constructor(message) {
    super(message, 'INVENTORY_ERROR');
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }
}

/**
 * Thrown when payment processing fails
 */
class PaymentError extends CheckoutError {
  constructor(message, stripeError = null) {
    super(message, 'PAYMENT_ERROR');
    this.stripeError = stripeError;
  }
}

/**
 * Thrown when order validation fails
 */
class OrderValidationError extends CheckoutError {
  constructor(message, validationErrors = []) {
    super(message, 'VALIDATION_ERROR');
    this.validationErrors = validationErrors;
  }
}

module.exports = {
  CheckoutError,
  InventoryError,
  PaymentError,
  OrderValidationError
};