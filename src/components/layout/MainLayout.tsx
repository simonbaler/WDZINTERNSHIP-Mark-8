// Import necessary dependencies and components
import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

// Define the props for the MainLayout component
interface MainLayoutProps {
  children: ReactNode; // The content to be rendered within the layout
}

// The MainLayout component provides the basic structure for the application
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* The header component, displayed at the top of the page */}
      <Header />
      {/* The main content area, where page-specific content is rendered */}
      <main className="flex-1">
        {children}
      </main>
      {/* The footer component, displayed at the bottom of the page */}
      <Footer />
      {/* The cart drawer, which can be opened from anywhere in the app */}
      <CartDrawer />
    </div>
  );
};
