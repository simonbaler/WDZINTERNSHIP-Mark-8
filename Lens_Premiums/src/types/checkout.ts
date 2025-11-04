/**
 * Types for the checkout process
 * This file contains all the TypeScript interfaces and types used in the checkout flow
 */

// Represents an item in the shopping cart
export interface CartItem {
  id: string;          // Unique identifier for the product
  name: string;        // Product name
  price: number;       // Product price in cents
  image: string;       // URL to product image
  quantity: number;    // Number of items
}

// Different types of orders we support
export type OrderType = 'purchase' | 'rental' | 'deposit';

// Main order interface
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  type: OrderType;
  status: OrderStatus;
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Possible states an order can be in
export type OrderStatus = 
  | 'pending'       // Initial state
  | 'processing'    // Payment is being processed
  | 'confirmed'     // Payment successful
  | 'failed'        // Payment failed
  | 'cancelled'     // Order was cancelled
  | 'refunded';     // Order was refunded

// For rental orders with deposits
export interface RentalDeposit {
  orderId: string;
  amount: number;
  status: 'held' | 'captured' | 'released';
  dueDate: Date;
}

// Checkout session configuration
export interface CheckoutConfig {
  mode: 'payment' | 'subscription';
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

// API Response types
export interface CheckoutResponse {
  sessionId: string;              // Stripe checkout session ID
  orderCreated: boolean;          // Whether order was created successfully
  inventoryReserved: boolean;     // Whether inventory was reserved
}

export interface StripePaymentResponse {
  clientSecret: string;           // Used for confirming payments
  paymentIntentId: string;       // Stripe payment intent ID
  requiresAction: boolean;        // If additional authentication is needed
}