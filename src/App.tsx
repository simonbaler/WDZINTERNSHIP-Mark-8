// Import necessary dependencies and components for the application
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { FeatureFlagsProvider } from "./contexts/FeatureFlagsContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Cameras from "./pages/Cameras";
import Lenses from "./pages/Lenses";
import Accessories from "./pages/Accessories";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AccountSettings from "./pages/account/Settings";
import Profile from "./pages/account/Profile";
import Orders from "./pages/account/Orders";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import Compare from "./pages/Compare";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/admin/AdminLogin";
import NotFound from "./pages/NotFound";
import MediaLibrary from "./pages/admin/MediaLibrary";
import Embeddings from "./pages/admin/Embeddings";
import Products from "./pages/admin/Products";
import Webhooks from "./pages/admin/Webhooks";
import CSVImport from "./pages/admin/CSVImport";
import Monitoring from "./pages/admin/Monitoring";
import FeatureFlags from "./pages/admin/FeatureFlags";
import Merchandising from "./pages/admin/Merchandising";
import Collection from "./pages/Collection";
import ProductImageGenerator from "./pages/admin/ProductImageGenerator";
import { AdvancedChatBot } from "./components/chat/AdvancedChatBot";
import AdminOrderDetail from "@/pages/admin/OrderDetail";
import UserOrderDetail from "./pages/account/OrderDetail";
import Account from "./pages/Account";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminCustomerDetail from "./pages/admin/CustomerDetail";
import AdminCategories from "./pages/admin/Categories";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AICopywriter from "./pages/admin/AICopywriter";
import AIPricing from "./pages/admin/AIPricing";
import AIInsights from "./pages/admin/AIInsights";
import Welcome from "./pages/Welcome";
import AdminWelcomeVideo from "./pages/admin/WelcomeVideo";
import { useProductsStore } from "./store/productsStore";
import AdminHeroSlides from "./pages/admin/HeroSlides";

// Create a new instance of QueryClient for managing server state
const queryClient = new QueryClient();

// The main App component that serves as the root of the application
const App = () => {
  // Retrieve the fetchProducts function from the products store
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  // useEffect hook to fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    // Provide the query client to the entire application
    <QueryClientProvider client={queryClient}>
      {/* Provide tooltip functionality throughout the app */}
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* Provide language context to the app */}
        <LanguageProvider>
          {/* Provide feature flags context to the app */}
          <FeatureFlagsProvider>
            {/* Toaster component for displaying notifications */}
            <Toaster />
            <Sonner />
            {/* Set up the application's routing */}
            <BrowserRouter>
              {/* Advanced AI ChatBot component available on all pages */}
              <AdvancedChatBot />
            {/* Main layout for the application */}
            <MainLayout>
              {/* Define the application's routes */}
              <Routes>
                {/* Public-facing routes */}
                <Route path="/" element={<Home />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/cameras" element={<Cameras />} />
                <Route path="/lenses" element={<Lenses />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/collections" element={<Collection />} />
                <Route path="/collections/:categorySlug" element={<Collection />} />
                <Route path="/collections/:categorySlug/:subSlug" element={<Collection />} />
                <Route path="/bundles" element={<Cameras />} />
                <Route path="/deals" element={<Cameras />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/search" element={<Search />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/compare" element={<Compare />} />

                {/* Admin-specific routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/welcome-video" element={<AdminWelcomeVideo />} />
                <Route path="/admin/media" element={<MediaLibrary />} />
                <Route path="/admin/embeddings" element={<Embeddings />} />
                <Route path="/admin/products" element={<Products />} />
                <Route path="/admin/webhooks" element={<Webhooks />} />
                <Route path="/admin/csv-import" element={<CSVImport />} />
                <Route path="/admin/monitoring" element={<Monitoring />} />
                <Route path="/admin/merchandising" element={<Merchandising />} />
                <Route path="/admin/image-generator" element={<ProductImageGenerator />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                <Route path="/admin/hero-slides" element={<AdminHeroSlides />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/customers/:id" element={<AdminCustomerDetail />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/ai-copywriter" element={<AICopywriter />} />
                <Route path="/admin/ai-pricing" element={<AIPricing />} />
                <Route path="/admin/ai-insights" element={<AIInsights />} />

                <Route path="/account" element={<Account />}>
                  <Route index element={<Profile />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="addresses" element={<div className="bg-card rounded-lg border p-6"><h2 className="text-2xl font-bold">Addresses</h2><p className="text-muted-foreground mt-2">Manage your addresses</p></div>} />
                  <Route path="payment" element={<div className="bg-card rounded-lg border p-6"><h2 className="text-2xl font-bold">Payment Methods</h2><p className="text-muted-foreground mt-2">Manage your payment methods</p></div>} />
                  <Route path="settings" element={<AccountSettings />} />
                </Route>

                {/* Catch-all route for 404 Not Found pages */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </FeatureFlagsProvider>
        </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
