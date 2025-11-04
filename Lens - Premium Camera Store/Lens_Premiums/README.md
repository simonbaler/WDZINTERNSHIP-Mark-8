# Camera Glaze

A modern e-commerce platform for premium camera equipment.

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm run dev
   ```
4. Set up the backend:
   ```
   cd backend
   npm install
   npm run dev
   ```

## Features

- Browse premium camera equipment
- Product search and filtering
- User authentication
- Shopping cart functionality
- Secure checkout process

## Tech Stack

- Frontend: React, TypeScript, Vite, TailwindCSS
- Backend: Node.js, Express, MySQL
- State Management: React Query, Zustand

## Project Structure

```
/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utility functions
│   ├── store/          # State management
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── backend/            # Node.js backend
│   ├── src/            # Backend source code
│   │   ├── config/     # Database configuration
│   │   ├── controllers/# API controllers
│   │   ├── models/     # Database models
│   │   ├── routes/     # API routes
│   │   └── index.js    # Entry point
│   └── package.json    # Backend dependencies
├── index.html          # HTML template
└── package.json        # Frontend dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
