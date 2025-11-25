# LENS - Premium Camera Store

A production-ready React + TypeScript camera store with Apple-inspired design, 3D capabilities, and modern e-commerce features.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:8080`

## ✅ Currently Implemented

### Design System
- **Premium color palette**: Deep blacks, warm amber accents (HSL-based for consistency)
- **Semantic design tokens**: All colors, gradients, shadows defined in `index.css`
- **Smooth animations**: Framer Motion for page transitions, hover effects, and micro-interactions
- **Responsive layout**: Mobile-first design with breakpoints

### Core Features
- ✅ **Sticky Header** with search, cart, wishlist icons
- ✅ **Cart Management** with Zustand (add, remove, update quantity, persistent storage)
- ✅ **Product Cards** with ratings, badges, hover effects, quick add to cart
- ✅ **Responsive Navigation** with mobile menu
- ✅ **Home Page** with hero section, featured categories, product grid
- ✅ **Footer** with newsletter signup, links, social media
- ✅ **404 Page** with branded design
- ✅ **SEO** meta tags, Open Graph, Twitter cards

### State Management
- Zustand for cart state with localStorage persistence
- React Query setup for future API integration

### Tech Stack
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS for styling
- Framer Motion for animations
- React Router DOM v6
- Zustand for state management
- @react-three/fiber & @react-three/drei (installed, ready for 3D)
- MSW (installed, ready for mocking)

## 🚧 To Be Implemented

### High Priority
1. **3D Product Viewer Component**
   - Location: `src/components/products/3DViewer.tsx`
   - Use react-three-fiber + drei
   - OrbitControls with keyboard support
   - Hotspot annotations
   - Fallback to 360° sprite viewer

2. **Mega Dropdown Navigation**
   - Multi-column layout (4 columns)
   - Category images + grouped links
   - Product preview cards in dropdowns
   - Keyboard navigation

3. **Product Detail Page**
   - Two-column layout (3D viewer left, info right)
   - Variant selector (updates 3D model)
   - Quantity stepper
   - Sticky add-to-cart
   - Accordion specs/shipping info
   - Related products

4. **Collection/Listing Page**
   - Sidebar filters (brand, price, specs)
   - Sort options
   - Grid/list view toggle
   - Pagination or infinite scroll

5. **Search Functionality**
   - Expanding search input (already animated)
   - Typeahead suggestions
   - Keyboard navigation
   - Search results page

6. **Checkout Flow**
   - 3-step wizard (Shipping → Payment → Confirmation)
   - Progress stepper
   - Address form with validation
   - Stripe integration (frontend ready)

### Medium Priority
7. **Mock API with MSW**
   - Mock handlers for products, cart, auth
   - Seed data (20 products with GLB models)
   - Environment flag `VITE_USE_MOCK`

8. **Account Pages**
   - Login/Register
   - Profile dashboard
   - Order history
   - Saved addresses
   - Wishlist

9. **Admin Panel (Basic)**
   - Product CRUD
   - Order management
   - Low stock alerts

10. **Animations**
    - Fly-to-cart animation on add to cart
    - Page transitions
    - Skeleton loaders with shimmer

### Lower Priority
11. **AI Assistant Modal**
    - Chat interface
    - Product context awareness
    - Quick comparison prompts

12. **Testing**
    - Playwright E2E tests
    - Unit tests for key components

13. **Performance**
    - Lazy loading for heavy components
    - Image optimization
    - Code splitting

## 📁 File Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, MainLayout
│   ├── cart/            # CartDrawer
│   ├── products/        # ProductCard
│   └── ui/              # Shadcn components
├── pages/               # Route pages (Home, Cameras, etc.)
├── store/               # Zustand stores (cartStore)
├── lib/                 # Utilities, mock data
├── types/               # TypeScript types
└── mocks/               # MSW handlers (TODO)
```

## 🎨 Design System

All design tokens are centralized in:
- `src/index.css` - CSS variables (colors, gradients, shadows)
- `tailwind.config.ts` - Extended Tailwind config (animations, utilities)

### Color Palette
- **Primary**: Deep black (#171717) - Premium feel
- **Accent**: Warm amber (#E87C17) - Highlights and CTAs
- **Background**: Pure white / Deep black (dark mode)
- **Muted**: Light grays for secondary content

### Key Animations
- `fade-in`, `scale-in` - Entry animations
- `fly-to-cart` - Add to cart effect
- `shimmer` - Loading states
- `float` - Subtle movement

## 🔌 API Integration (TODO)

Replace mock data with real API calls:
1. Update `src/lib/mockData.ts` with API endpoints
2. Create React Query hooks in `src/hooks/useProducts.ts`
3. Add environment variables for API base URL

Example:
```typescript
// src/hooks/useProducts.ts
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      return res.json();
    }
  });
};
```

## 📦 Mock Data

Current mock products in `src/lib/mockData.ts`:
- 8 sample products (cameras, lenses, accessories)
- Placeholder images
- Ready for GLB model URLs

To add real products:
1. Update `mockProducts` array
2. Add real images to `public/images/`
3. Add GLB files to `public/models/` for 3D viewer

## 🎯 Next Steps

1. **Implement 3D Viewer** - Most unique feature, high impact
2. **Complete Product Detail Page** - Essential for conversions
3. **Add MSW Mocks** - Enable full UI testing without backend
4. **Build Collection Page** - Enable browsing and filtering
5. **Add Mega Dropdowns** - Enhance navigation UX

## 📝 Notes

- All colors use HSL format for consistency
- No hardcoded colors in components (use design tokens)
- Framer Motion respects `prefers-reduced-motion`
- Cart persists to localStorage
- Mobile-first responsive design

## 🔗 Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Framer Motion API](https://www.framer.com/motion/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [MSW Documentation](https://mswjs.io/)

---

Built with ❤️ using Lovable
