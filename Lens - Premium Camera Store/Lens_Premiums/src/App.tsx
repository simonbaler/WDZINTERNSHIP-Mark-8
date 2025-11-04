// This is the main App component
// Importing all the UI stuff and pages
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Cameras from "./pages/Cameras";
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
import NotFound from "./pages/NotFound";
import OTPLogin from "./pages/OTPLogin";
import { ChatBot } from "./components/chat/ChatBot";

// Setting up the query client for API calls
const queryClient = new QueryClient();

// Main App component - this handles all the routing
const App = () => {
  console.log('App component is rendering'); // Debug log

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ChatBot />
          <MainLayout>
            <Routes>
              {/* Home page */}
              <Route path="/" element={<Home />} />
              {/* Camera related pages */}
              <Route path="/cameras" element={<Cameras />} />
              <Route path="/lenses" element={<Cameras />} />
              <Route path="/accessories" element={<Cameras />} />
              <Route path="/bundles" element={<Cameras />} />
              <Route path="/deals" element={<Cameras />} />
              <Route path="/collections" element={<Cameras />} />
              {/* Product detail page */}
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* Shopping related */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              {/* Search and auth */}
              <Route path="/search" element={<Search />} />
              <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<OTPLogin />} />
              {/* Other pages */}
              <Route path="/compare" element={<Compare />} />
              <Route path="/admin" element={<Admin />} />
              {/* Account section with nested routes */}
              <Route path="/account" element={<Account />}>
                <Route index element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="addresses" element={<div className="bg-card rounded-lg border p-6"><h2 className="text-2xl font-bold">Addresses</h2><p className="text-muted-foreground mt-2">Manage your addresses</p></div>} />
                <Route path="payment" element={<div className="bg-card rounded-lg border p-6"><h2 className="text-2xl font-bold">Payment Methods</h2><p className="text-muted-foreground mt-2">Manage your payment methods</p></div>} />
                <Route path="settings" element={<div className="bg-card rounded-lg border p-6"><h2 className="text-2xl font-bold">Settings</h2><p className="text-muted-foreground mt-2">Manage your account settings</p></div>} />
              </Route>
              {/* Catch all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
