import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { FeatureFlagsProvider } from "./contexts/FeatureFlagsContext";
import Home from "./pages/Home";
import Cameras from "./pages/Cameras";
import Lenses from "./pages/Lenses";
import Accessories from "./pages/Accessories";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
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
import { ChatBot } from "./components/chat/ChatBot";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FeatureFlagsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ChatBot />
          <MainLayout>
            <Routes>
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
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/welcome-video" element={<AdminWelcomeVideo />} />
        <Route path="/admin/media" element={<MediaLibrary />} />
        <Route path="/admin/embeddings" element={<Embeddings />} />
        <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/webhooks" element={<Webhooks />} />
            <Route path="/admin/csv-import" element={<CSVImport />} />
          <Route path="/admin/monitoring" element={<Monitoring />} />
          <Route path="/admin/feature-flags" element={<FeatureFlags />} />
          <Route path="/admin/merchandising" element={<Merchandising />} />
          <Route path="/admin/image-generator" element={<ProductImageGenerator />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
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
              <Route path="settings" element={<div className="bg-card rounded-lg border p-6"><h2 className="text-2xl font-bold">Settings</h2><p className="text-muted-foreground mt-2">Manage your account settings</p></div>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </FeatureFlagsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
