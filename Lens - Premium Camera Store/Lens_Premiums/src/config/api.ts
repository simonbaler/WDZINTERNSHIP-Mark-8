/**
 * API Configuration File
 * Store all API keys and configuration for external services and admin panel
 */

// Backend API Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
};

// Admin Panel Configuration
export const ADMIN_CONFIG = {
  // Admin panel will check user_roles table in database
  // No hardcoded credentials - security is handled by RLS policies
  adminRoleName: 'admin' as const,
  customerRoleName: 'customer' as const,
};

// Payment Gateway Configuration (Add your keys here when ready)
export const PAYMENT_CONFIG = {
  // Example: Razorpay, Stripe, PayPal
  // razorpayKey: 'YOUR_RAZORPAY_KEY',
  // stripePublicKey: 'YOUR_STRIPE_PUBLIC_KEY',
};

// Email Service Configuration (Add your keys here when ready)
export const EMAIL_CONFIG = {
  // Example: SendGrid, Mailgun
  // sendgridApiKey: 'YOUR_SENDGRID_KEY',
};

// SMS Service Configuration (Add your keys here when ready)
export const SMS_CONFIG = {
  // Example: Twilio, MSG91
  // twilioAccountSid: 'YOUR_TWILIO_SID',
};

// Social Media Integration (Add your keys here when ready)
export const SOCIAL_CONFIG = {
  // facebookAppId: 'YOUR_FACEBOOK_APP_ID',
  // googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
};

// Analytics Configuration (Add your keys here when ready)
export const ANALYTICS_CONFIG = {
  // googleAnalyticsId: 'YOUR_GA_ID',
};

// Feature Flags
export const FEATURES = {
  enableReviews: true,
  enableWishlist: true,
  enableCompare: true,
  enableSocialLogin: false,
  enableGuestCheckout: true,
};
