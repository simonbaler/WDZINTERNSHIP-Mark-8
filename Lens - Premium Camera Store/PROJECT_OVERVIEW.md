# Camera Glaze Forge - Project Overview

## Project Description
Camera Glaze Forge is a full-stack e-commerce web application focused on camera products. It provides a comprehensive platform for browsing, comparing, and purchasing cameras, with features like user authentication, shopping cart, wishlist, product comparison, and an admin panel for management. The application is built using modern web technologies, including a React-based frontend and a Node.js backend, integrated with Supabase for database management.

## Technology Stack
- **Frontend**: React 18 with TypeScript, Vite for build tooling, Tailwind CSS for styling, and Shadcn UI components for consistent design.
- **Backend**: Node.js with Express.js framework, handling API routes for products, orders, and users.
- **Database**: Supabase (PostgreSQL-based) for data storage and real-time features.
- **State Management**: Zustand for client-side state (auth, cart, wishlist, compare).
- **Other Tools**: ESLint for code linting, PostCSS for CSS processing, Bun for package management.

## Key Features

### User-Facing Features
1. **Product Browsing and Search**:
   - Homepage with featured products.
   - Dedicated Cameras page for browsing all camera products.
   - Product detail pages with image galleries, tabs for specifications, and related products.
   - Search functionality across products.

2. **Shopping Cart**:
   - Add/remove products to cart.
   - Cart drawer for quick access.
   - Persistent cart state across sessions.

3. **Wishlist**:
   - Save favorite products for later.
   - Manage wishlist items.

4. **Product Comparison**:
   - Compare multiple products side-by-side.
   - Add/remove products from comparison list.

5. **User Authentication**:
   - Sign up, login, and logout.
   - Account management (profile, orders).
   - Protected routes for authenticated users.

6. **Checkout Process**:
   - Step-by-step checkout flow.
   - Order placement and confirmation.

7. **Chatbot Integration**:
   - AI-powered chatbot for customer assistance.

8. **Responsive Design**:
   - Mobile-friendly layout using Tailwind CSS.

### Admin Features
1. **Admin Panel**:
   - Manage products (add, edit, delete).
   - View and manage orders.
   - User management.

### Backend Features
1. **API Endpoints**:
   - Product routes: CRUD operations for products.
   - Order routes: Handle order creation and retrieval.
   - User routes: User registration, login, and profile management.

2. **Database Integration**:
   - Supabase for data persistence.
   - Migrations for database schema management.

3. **Configuration**:
   - Database connection and initialization scripts.

## Project Structure
```
camera-glaze-forge-77943-main/
├── backend/                          # Backend application
│   ├── src/
│   │   ├── index.js                  # Main server entry point
│   │   ├── config/
│   │   │   ├── db.js                 # Database configuration
│   │   │   └── init-db.js            # Database initialization
│   │   ├── models/
│   │   │   └── Product.js            # Product data model
│   │   └── routes/
│   │       ├── productRoutes.js      # Product API routes
│   │       ├── orderRoutes.js        # Order API routes
│   │       └── userRoutes.js         # User API routes
│   ├── package.json                  # Backend dependencies
│   └── README.md                     # Backend documentation
├── src/                              # Frontend source code
│   ├── components/                   # Reusable UI components
│   │   ├── cart/                     # Cart-related components
│   │   ├── chat/                     # Chatbot component
│   │   ├── layout/                   # Layout components (Header, Footer, MainLayout)
│   │   ├── product/                  # Product-specific components (Gallery, Tabs, etc.)
│   │   ├── products/                 # Product listing components
│   │   └── ui/                       # Shadcn UI components
│   ├── config/                       # Configuration files
│   ├── hooks/                        # Custom React hooks
│   ├── integrations/                 # Third-party integrations (Supabase)
│   ├── lib/                          # Utility libraries and mock data
│   ├── pages/                        # Page components
│   │   ├── account/                  # Account-related pages
│   │   └── ...                       # Other pages (Home, Cameras, etc.)
│   ├── store/                        # Zustand state stores
│   └── types/                        # TypeScript type definitions
├── supabase/                         # Supabase configuration and migrations
├── public/                           # Static assets
├── index.html                        # Main HTML file
├── package.json                      # Frontend dependencies
├── vite.config.ts                    # Vite configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project documentation
```

## Installation and Setup
1. **Prerequisites**: Node.js, Bun (or npm), Supabase account.
2. **Clone the repository**: `git clone <repo-url>`
3. **Install dependencies**:
   - Frontend: `bun install` (or `npm install`)
   - Backend: `cd backend && npm install`
4. **Set up Supabase**: Configure Supabase project and run migrations.
5. **Run the application**:
   - Frontend: `bun run dev`
   - Backend: `cd backend && npm start`
6. **Access the app**: Open `http://localhost:5173` for frontend, backend on configured port.

## Development Notes
- The project uses TypeScript for type safety.
- State management is handled via Zustand stores.
- UI components are built with Shadcn for consistency.
- API calls are abstracted in hooks and lib files.
- Mock data is available for development/testing.

## Future Enhancements
- Payment gateway integration.
- Advanced search and filtering.
- User reviews and ratings.
- Inventory management.
- Multi-language support.

This overview covers the core aspects of the Camera Glaze Forge project. For detailed implementation, refer to the source code and individual component documentation.
