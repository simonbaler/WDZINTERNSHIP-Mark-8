# Camera Glaze Backend

Node.js and MySQL backend for the Camera Glaze application.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create MySQL database:
   ```sql
   CREATE DATABASE camera_glaze_db;
   ```

3. Configure environment variables in `.env` file

4. Start the server:
   ```
   npm run dev
   ```

The server will run on http://localhost:5000

## API Endpoints

- Products: `/api/products`
- Users: `/api/users`
- Orders: `/api/orders`