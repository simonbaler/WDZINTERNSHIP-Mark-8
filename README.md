# LENS – Premium Camera Store (React + TypeScript)

LENS is a production-ready e‑commerce frontend for cameras, lenses, and accessories. It features premium design, cinematic hero visuals, modern navigation, a responsive layout, and an admin area for merchandising and content management.

## Quick Start

- Requirements: Node.js 18+, npm
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (`darkMode: "class"` with design tokens)
- shadcn‑ui (Radix primitives + utility components)
- Framer Motion (animations and micro‑interactions)
- Zustand (state management with persistence)
- React Router v6
- React Query (client state infra)
- next‑themes (light/dark theme management)

## Core Features

- Premium sticky header with desktop mega‑menu and mobile menu
- Cinematic hero section with grain overlay, staggered animations, 3D‑style parallax
- Admin hero slides management (CRUD with persistence)
- Product listing, details, comparisons, wishlist, cart drawer
- Responsive UI for mobile, tablet, and desktop
- Dark and light theme toggle with OS “system” support
- Language context infrastructure and multi‑language readiness
- Toast notifications and modern dialogs/forms

## Highlights Implemented

- Header UI upgrade with glassmorphism, soft shadows, and micro‑interactions
- Premium UI toggle to enable/disable advanced header visuals (persisted)
- Theme toggle (dark/light) available on desktop and mobile
- Admin page for hero slides: add, edit, delete, and persist slides
- Hero carousel sourced from store; updates reflect on Home instantly

## Application Structure

- Entry: `src/main.tsx`
- App shell: `src/App.tsx` (providers, router, layout)
- Layout: `src/components/layout/MainLayout.tsx`, `src/components/layout/Header.tsx`
- Pages: `src/pages/*` (Home, ProductDetail, Cart, Checkout, Search, Account, Admin, etc.)
- Stores: `src/store/*` (cart, products, hero slides, etc.)
- UI: `src/components/ui/*` (buttons, inputs, toasts, dialogs, switch, etc.)
- Product components: `src/components/product/*` (cards, 3D viewer, gallery)
- Utilities: `src/lib/*` (helpers, carousel data, hooks)

## Theming

- Provider: `ThemeProvider` from `next-themes` wraps the app (`attribute="class"`)
- Tailwind tokens map to CSS variables for `background`, `foreground`, `primary`, `accent`, etc.
- Theme toggle in header and mobile menu switches between `light` and `dark`

## State Management

- Zustand stores with `persist` for client‑side persistence
- Examples:
  - `useCartStore`: cart items, totals, drawer open/close
  - `useHeroSlidesStore`: hero slides CRUD, persisted to `localStorage`

## Admin Area

- Routes under `/admin/*`
- Key pages: Products, Customers, Orders, Analytics, Settings, Merchandising
- Hero slides management: `/admin/hero-slides` with full CRUD
- Admin login: `/admin/login`

## Hero Section

- Desktop parallax on text blocks, disabled on mobile for performance
- Staggered entrance for title, subtitle, and actions
- Floating gradient blobs and live status badge for depth
- Grain overlay over carousel for film‑like aesthetic

## Developer Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: build production assets
- `npm run preview`: serve built assets locally
- `npm run lint`: run ESLint over the project

## Environment and Configuration

- Tailwind: `tailwind.config.ts` (`darkMode: ["class"]`, tokens via CSS variables)
- React Query: client provided in `src/App.tsx`
- Theme: `ThemeProvider` in `src/App.tsx`
- Animations: Framer Motion across hero, header micro‑interactions, and UI components

## Accessibility

- Keyboard‑accessible menus and toggles via Radix primitives
- Focus styles and reduced motion friendly transitions
- Switch component supports sizes, variants, and `aria-*` props

## Deployment

- Build with `npm run build`
- Preview locally with `npm run preview`
- Host static `dist/` on any modern static host (Netlify, Vercel, Cloudflare Pages, etc.)

## Contributing

- Fork and create a branch per feature/fix
- Run `npm run lint` before pushing
- Keep to existing component patterns, styling tokens, and accessibility practices

