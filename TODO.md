# TODO: Convert Supabase to Node.js with MySQL

## Completed
- [x] Analyze codebase and create conversion plan
- [x] Get user approval for plan

## In Progress
- [ ] Create backend/ directory and initialize Node.js project
- [ ] Install backend dependencies (express, mysql2, jsonwebtoken, bcryptjs, multer, cors, dotenv)
- [ ] Read and convert Supabase migration files to MySQL schema
- [ ] Create database connection and configuration
- [ ] Set up Express server with basic middleware
- [ ] Implement authentication endpoints (register, login, logout, password reset)
- [ ] Convert Supabase functions to Express routes:
  - [ ] ar-showroom
  - [ ] categories-list
  - [ ] category-analytics
  - [ ] compare-products
  - [ ] csv-import
  - [ ] edge-personalization
  - [ ] emit-webhook
  - [ ] federated-learning
  - [ ] gdpr-delete
  - [ ] gdpr-export
  - [ ] generate-embeddings
  - [ ] generate-product-images
  - [ ] health-check
  - [ ] media-process-notify
  - [ ] media-signed-upload
  - [ ] order-created
  - [ ] product-chat
  - [ ] products-filter
  - [ ] provenance-ledger
  - [ ] replay-webhook
  - [ ] search-semantic
  - [ ] search-visual
  - [ ] webauthn-payment
- [ ] Implement file upload/storage endpoints
- [ ] Update src/config/api.ts to use backend URL
- [ ] Replace Supabase client usage in frontend (auth, database, functions)
- [ ] Remove @supabase/supabase-js from package.json
- [ ] Remove supabase/ directory and src/integrations/supabase/
- [ ] Set up MySQL database and run schema
- [ ] Test backend endpoints
- [ ] Test full application
