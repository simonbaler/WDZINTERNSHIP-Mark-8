# API Configuration Guide

## Overview
This file documents all API keys and configuration needed for the camera store ecommerce platform.

## Core Backend (Lovable Cloud)
The application uses Lovable Cloud (powered by Supabase) for backend functionality:
- **Database**: PostgreSQL with full ecommerce schema
- **Authentication**: Email/password with auto-confirm enabled
- **Storage**: Ready for product images and user uploads
- **Edge Functions**: Serverless functions for custom logic

All backend configuration is automatically managed in `src/config/api.ts`.

## Database Schema

### Tables Created:
1. **profiles** - User profile information with location
2. **categories** - Product categories with hierarchical structure
3. **products** - Product catalog with variants and specifications
4. **user_roles** - Role-based access control (admin/customer)
5. **orders** - Customer orders with status tracking
6. **order_items** - Individual items in orders
7. **reviews** - Product reviews and ratings

### Security Features:
- Row Level Security (RLS) enabled on all tables
- Admin role checking via secure database functions
- Customer data isolated per user
- Public read access for products and categories

## Admin Access

### How to Create an Admin User:
1. Sign up for an account through the `/auth` page
2. Get your user ID from the backend dashboard
3. Add an admin role in the backend:
   - Open Lovable Cloud dashboard
   - Navigate to the `user_roles` table
   - Insert a new row with:
     - `user_id`: Your user ID from auth.users
     - `role`: 'admin'

### Admin Features:
- Access admin dashboard at `/admin`
- Manage products, orders, categories
- View customer data and analytics
- Configure store settings

## Payment Integration (Optional)

### Razorpay (Recommended for India):
1. Sign up at https://razorpay.com/
2. Get your API keys from the dashboard
3. Add to `src/config/api.ts`:
```typescript
export const PAYMENT_CONFIG = {
  razorpayKey: 'YOUR_RAZORPAY_KEY_ID',
};
```

### Stripe (International):
1. Sign up at https://stripe.com/
2. Get your publishable key
3. Add to `src/config/api.ts`:
```typescript
export const PAYMENT_CONFIG = {
  stripePublicKey: 'YOUR_STRIPE_PUBLIC_KEY',
};
```

## Email Service (Optional)

### SendGrid:
1. Sign up at https://sendgrid.com/
2. Create an API key
3. Store in backend secrets (not in code!)

### Mailgun:
1. Sign up at https://mailgun.com/
2. Get API credentials
3. Store in backend secrets

## SMS Service (Optional)

### Twilio:
1. Sign up at https://twilio.com/
2. Get Account SID and Auth Token
3. Store in backend secrets

### MSG91 (India):
1. Sign up at https://msg91.com/
2. Get API key
3. Store in backend secrets

## Social Login (Optional)

### Google Authentication:
Already supported by Lovable Cloud! Just enable in the backend settings.

### Facebook Login:
1. Create app at https://developers.facebook.com/
2. Get App ID and App Secret
3. Configure in Lovable Cloud auth settings

## Analytics (Optional)

### Google Analytics:
1. Create property at https://analytics.google.com/
2. Get Measurement ID
3. Add to `src/config/api.ts`:
```typescript
export const ANALYTICS_CONFIG = {
  googleAnalyticsId: 'G-XXXXXXXXXX',
};
```

## File Storage

Product images and user uploads are handled by Lovable Cloud Storage:
- Automatic CDN distribution
- Image optimization
- Secure access control
- No additional configuration needed

## Environment Variables

All sensitive configuration is managed through:
1. **Frontend**: `src/config/api.ts` for public keys
2. **Backend**: Lovable Cloud secrets for private keys

Never commit sensitive keys to the repository!

## Testing the Setup

1. **Authentication**: Visit `/auth` and create an account
2. **Products**: Products are visible on home page (add seed data)
3. **Cart**: Add products and test checkout flow
4. **Admin**: Grant yourself admin role and access `/admin`
5. **Orders**: Complete an order and check `/account/orders`

## Next Steps

1. Add product seed data to populate the store
2. Configure payment gateway for production
3. Set up email notifications for orders
4. Enable Google authentication for easier login
5. Add analytics to track user behavior

## Support

For issues with:
- **Backend/Database**: Check Lovable Cloud dashboard
- **Authentication**: Verify user_roles table setup
- **Payments**: Check payment gateway documentation
- **General**: Review console logs and network requests
