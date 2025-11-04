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
   # Camera Glaze Forge — Project Overview

   This document provides a complete and up-to-date overview of the Camera Glaze Forge application, including architecture, how to run locally, environment variables, deployment instructions (Render), database and migration notes, testing, and troubleshooting tips.

   ## Short description
   Camera Glaze Forge is a modern full-stack e-commerce application focused on camera gear (cameras, lenses, accessories). It includes a React + TypeScript frontend (Vite), a Node.js + Express backend, and tooling for database migrations and third-party integrations (Stripe, Twilio, Supabase/SQL). The app supports browsing, product detail, cart & checkout, wishlist, product comparison, user accounts, and an admin surface.

   ## Architecture & where code lives
   - Frontend (Vite + React + TypeScript): `Lens_Premiums/` — build output -> `dist`
   - Backend (Node + Express): `Lens_Premiums/backend/` — server entry `src/index.js`
   - Migrations: `Lens_Premiums/backend/src/migrations/` (SQL files + migration runner `migrate.js`)
   - Supabase config (if used): `Lens_Premiums/supabase/`
   - Static assets: `Lens_Premiums/public/`

   High-level flow:
   - Browser -> Frontend UI (Vite static site)
   - Frontend -> Backend API (e.g. `/api/products`, `/api/status`)
   - Backend -> Database (optional) for persistence

   ## Quick local development (recommended)
   Prereqs: Node 18+ (or Node matching project), npm (or bun if you prefer), Git.

   1. Clone repo:

   ```bash
   git clone <repo-url>
   cd "Lens - Premium Camera Store/Lens_Premiums"
   ```

   2. Install frontend deps and run dev server:

   ```bash
   npm ci
   npm run dev
   # Vite dev server typically runs at http://localhost:5173
   ```

   3. Backend (in a separate terminal):

   ```bash
   cd Lens_Premiums/backend
   npm ci
   npm run dev      # uses nodemon for local development
   # or: npm start  # production start
   ```

   4. Smoke checks:
   - Frontend: open `http://localhost:5173`
   - Backend health: `GET http://localhost:<PORT>/api/status` (default PORT=3000)

   Notes: The backend has an in-memory dataset fallback if no DB is configured, so the app can be used for UI/dev without a database.

   ## Environment variables (what to provide)
   Set these in a `.env` locally (do NOT commit secrets) or in your hosting provider's secrets manager.

   Backend (common):
   - NODE_ENV=development|production
   - PORT (Render/hosting sets this automatically)
   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (for MySQL) OR DATABASE_URL (Postgres)
   - JWT_SECRET
   - STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY (if payments enabled)
   - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN (if Twilio used)

   Frontend (Vite):
   - Vite uses `import.meta.env.VITE_...` variables. Look in `Lens_Premiums/src/config/api.ts` or `src/lib/api.ts` for the exact variable name (commonly `VITE_API_URL`).
   - Example: `VITE_API_URL=https://camera-backend.onrender.com`

   I can scan the repo to produce an exact list of environment variable names if you want.

   ## Database & migrations (notes and recommendations)
   The repo contains both MySQL client usage (`mysql2` in `src/config/db.js`) and a Postgres-style migration runner (`src/migrations/migrate.js`) with Postgres SQL files. This is an important divergence to resolve for production.

   Options:
   - Use the in-memory fallback (no DB) for demos — fastest.
   - Use MySQL (adapt migrations): provision PlanetScale/AWS RDS MySQL and set DB_* env vars. Convert SQL migrations if necessary (Postgres `CREATE TYPE` enums, triggers, and `plpgsql` functions must be adapted to MySQL).
   - Use PostgreSQL: provision a Postgres DB (Render Postgres, Heroku, RDS), set `DATABASE_URL`, and run the existing `migrate.js` (it uses `pg`). If you choose Postgres, update `src/config/db.js` to use `pg` or add a Postgres connection instead of `mysql2`.

   Recommended for minimal friction: pick PostgreSQL and run the existing migration runner (it will create `migrations` tracking table and apply SQL files). Alternatively, keep MySQL and migrate SQL files manually.

   To run migrations (Postgres path):

   ```bash
   cd Lens_Premiums/backend
   export DATABASE_URL="postgres://user:pass@host:port/dbname"   # Windows: setx or use .env
   node src/migrations/migrate.js
   ```

   ## Deploying to Render (concise steps)
   This repo is well-suited to Render with two services: a Static Site for the frontend and a Web Service for the backend.

   Frontend (Static Site):
   - Root directory: `Lens_Premiums`
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`

   Backend (Web Service):
   - Root directory: `Lens_Premiums/backend`
   - Build command: `npm ci`
   - Start command: `npm start` (use `npm run dev` only for development)
   - Health check path: `/api/status`

   Environment variables to set in Render:
   - Backend: `DATABASE_URL` or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `NODE_ENV=production`.
   - Frontend: `VITE_API_URL` -> backend URL.

   Optional: create `render.yaml` at repo root so Render can provision services from code. If you'd like, I can generate a `render.yaml` for you.

   ## Example `render.yaml` (replace repo/owner placeholders)
   ```yaml
   services:
     - type: static
       name: camera-glaze-frontend
       env: node
       branch: main
       root: Lens_Premiums
       buildCommand: npm ci && npm run build
       publishPath: dist

     - type: web
       name: camera-glaze-backend
       env: node
       branch: main
       root: Lens_Premiums/backend
       buildCommand: npm ci
       startCommand: npm start
       healthCheckPath: /api/status
   ```

   ## Testing & CI
   - Playwright e2e tests are present (`test:e2e` scripts in frontend `package.json`). Run them with:

   ```bash
   cd Lens_Premiums
   npm run test:e2e
   ```

   - Add CI steps (GitHub Actions) to run lint, unit tests (if any), and the Playwright tests against a deployed preview environment.

   ## Troubleshooting checklist
   - 500 errors on backend: check Render logs, verify env vars (DB credentials, JWT secret).
   - Migrations fail: ensure DB dialect matches SQL files (Postgres vs MySQL). Use `migrate.js` for Postgres path.
   - Frontend cannot reach backend: check `VITE_API_URL`, CORS (backend uses `cors()`), and the backend service URL.
   - Dependency errors: run `npm ci` locally to see deterministic installs.

   ## File map (key files)
   - `Lens_Premiums/` — frontend root (Vite + React + TS)
   - `Lens_Premiums/src/config/api.ts` — API base URL config for frontend
   - `Lens_Premiums/backend/src/index.js` — backend entry
   - `Lens_Premiums/backend/src/config/db.js` — DB connection (currently mysql2)
   - `Lens_Premiums/backend/src/migrations/` — SQL migrations + `migrate.js`

   ## Contribution & contact
   - To contribute: fork → feature branch → PR. Run `npm ci` in both frontend and backend when testing locally. Include tests where appropriate.
   - For questions about deployment or environment variables, open an issue in this repo or reach the maintainers.

   ---

   If you'd like, I can now:
   1. Generate and commit a `render.yaml` configured for this repo.
   2. Produce an exact list of environment variable names used by frontend and backend (I can scan files and return a checklist).
   3. Add a simple `postinstall` or `start` script that runs migrations safely on startup (idempotent) and commit it.

   Tell me which of those you'd like next and I'll implement it.
