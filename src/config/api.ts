/**
 * API Configuration File
 * Store all API keys and configuration for external services and admin panel
 */

// Supabase Configuration (automatically managed)
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
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

// Feature Flags (Legacy - use database feature_flags table instead)
export const FEATURES = {
  enableReviews: true,
  enableWishlist: true,
  enableCompare: true,
  enableSocialLogin: false,
  enableGuestCheckout: true,
};

// Futuristic 2030+ Features (Managed in database)
// Access via useFeatureFlag('flag_key') hook
export const FUTURISTIC_FEATURES = {
  EDGE_PERSONALIZATION: 'edge_personalization',
  AR_SHOWROOM: 'ar_showroom',
  FEDERATED_LEARNING: 'federated_learning',
  WEBAUTHN_PAYMENTS: 'webauthn_payments',
  PROVENANCE_LEDGER: 'provenance_ledger',
} as const;

// Gemini AI Configuration
export const GEMINI_CONFIG = {
  // Prefer env var if available; fallback to provided key
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDsXabja6mqd4s53J72GoRp_ZhQArYS91U',
  model: 'gemini-1.5-pro',
};
