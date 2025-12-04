// Import necessary dependencies and components
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, Home, LogOut, Mic, GitCompare, Camera as CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/store/cartStore';
import { useCompareStore } from '@/store/compareStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';

// Define the navigation items for the header
const navItems = [
  { 
    label: 'Collections', 
    href: '/collections',
    megaMenu: {
      featured: { image: 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b?w=400', cta: 'Shop Collections' },
      columns: [
        { title: 'By Season', links: [
          { label: 'New Arrivals', href: '/collections?filter=new' },
          { label: 'Best Sellers', href: '/collections?filter=bestsellers' },
          { label: 'Limited Edition', href: '/collections?filter=limited' },
        ]},
        { title: 'By Category', links: [
          { label: 'Professional', href: '/collections?category=pro' },
          { label: 'Enthusiast', href: '/collections?category=enthusiast' },
          { label: 'Beginner', href: '/collections?category=beginner' },
        ]},
      ]
    }
  },
  { 
    label: 'Cameras', 
    href: '/cameras',
    megaMenu: {
      featured: { image: 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b?w=400', cta: 'Shop Cameras' },
      columns: [
        { title: 'By Type', links: [
          { label: 'Mirrorless', href: '/cameras?type=mirrorless' },
          { label: 'DSLR', href: '/cameras?type=dslr' },
          { label: 'Point & Shoot', href: '/cameras?type=pointshoot' },
          { label: 'Film Cameras', href: '/cameras?type=film' },
        ]},
        { title: 'By Sensor', links: [
          { label: 'Full Frame', href: '/cameras?sensor=fullframe' },
          { label: 'APS-C', href: '/cameras?sensor=apsc' },
          { label: 'Micro Four Thirds', href: '/cameras?sensor=mft' },
        ]},
        { title: 'By Use', links: [
          { label: 'Studio', href: '/cameras?use=studio' },
          { label: 'Vlogging', href: '/cameras?use=vlogging' },
          { label: 'Travel', href: '/cameras?use=travel' },
        ]},
      ]
    }
  },
  { 
    label: 'Lenses', 
    href: '/lenses',
    megaMenu: {
      featured: { image: 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b?w=400', cta: 'Shop Lenses' },
      columns: [
        { title: 'By Type', links: [
          { label: 'Prime', href: '/lenses?type=prime' },
          { label: 'Zoom', href: '/lenses?type=zoom' },
          { label: 'Wide Angle', href: '/lenses?type=wide' },
          { label: 'Telephoto', href: '/lenses?type=telephoto' },
        ]},
        { title: 'By Mount', links: [
          { label: 'Canon RF', href: '/lenses?mount=canon-rf' },
          { label: 'Sony E', href: '/lenses?mount=sony-e' },
          { label: 'Nikon Z', href: '/lenses?mount=nikon-z' },
        ]},
      ]
    }
  },
  { 
    label: 'Accessories', 
    href: '/accessories',
    megaMenu: {
      featured: { image: 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b?w=400', cta: 'Shop Accessories' },
      columns: [
        { title: 'Essentials', links: [
          { label: 'Tripods', href: '/accessories?cat=tripods' },
          { label: 'Bags', href: '/accessories?cat=bags' },
          { label: 'Memory Cards', href: '/accessories?cat=memory' },
          { label: 'Batteries', href: '/accessories?cat=batteries' },
        ]},
        { title: 'Lighting', links: [
          { label: 'Flash', href: '/accessories?cat=flash' },
          { label: 'LED Lights', href: '/accessories?cat=led' },
          { label: 'Reflectors', href: '/accessories?cat=reflectors' },
        ]},
      ]
    }
  },
  { label: 'Bundles', href: '/bundles' },
  { label: 'Deals', href: '/deals' },
];

// The Header component, which serves as the main navigation for the site
export const Header = () => {
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [premiumHeader, setPremiumHeader] = useState<boolean>(() => {
    try { return localStorage.getItem('PREMIUM_HEADER') === 'true'; } catch { return true; }
  });
  const { getTotalItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { items: compareItems } = useCompareStore();
  const { user, isAdmin, signOut: authSignOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const totalItems = getTotalItems();

  // Handles the search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

  // Handles the user logout process
  const handleLogout = async () => {
    await authSignOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (typeof window !== 'undefined') {
    try { localStorage.setItem('PREMIUM_HEADER', premiumHeader ? 'true' : 'false'); } catch {}
  }

  return (
    <header className={`sticky top-0 z-50 ${premiumHeader ? 'bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50 border-b border-border/50 shadow-sm' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border'}`}>
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center justify-center text-sm">
          <p>Free shipping over ₹4,999 — 30-day returns</p>
        </div>
      </div>

      {/* Main header content */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left section: Logo and mobile menu toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-lg hover:bg-white/5 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white/5 transition-all" onClick={() => navigate('/') }>
                <motion.span whileHover={premiumHeader ? { scale: 1.06, rotate: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Home className="h-5 w-5" />
                </motion.span>
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <div className="text-2xl font-bold tracking-tight">
                  <span className={`bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent ${premiumHeader ? 'drop-shadow-sm' : ''}`}>
                    LENS
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Center section: Main navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              item.megaMenu ? (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium rounded-lg px-3 py-2 hover:bg-white/5 hover:shadow-sm transition-all">
                      {item.label}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[640px] p-6 rounded-2xl shadow-xl border bg-background/80 backdrop-blur-xl">
                    <div className="grid grid-cols-3 gap-6">
                      {item.megaMenu.columns.map((column) => (
                        <div key={column.title}>
                          <h3 className="font-semibold mb-3 text-sm text-muted-foreground">{column.title}</h3>
                          <div className="space-y-2">
                            {column.links.map((link) => (
                              <DropdownMenuItem key={link.href} asChild>
                                <Link to={link.href} className="w-full cursor-pointer rounded-md px-2 py-1.5 hover:bg-accent/20 transition-colors">
                                  {link.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.href} to={item.href}>
                  <Button variant="ghost" className="text-sm font-medium rounded-lg px-3 py-2 hover:bg-white/5 hover:shadow-sm transition-all">
                    {item.label}
                  </Button>
                </Link>
              )
            ))}
          </nav>

          {/* Right section: Icons for search, account, wishlist, and cart */}
          <div className="flex items-center gap-2">
            {/* Welcome Page Button */}
            <Button
              variant="ghost"
              size="icon"
              title="Welcome"
              onClick={() => navigate('/welcome')}
              className="hidden md:flex rounded-lg hover:bg-white/5 transition-all"
            >
              <motion.span whileHover={premiumHeader ? { scale: 1.06, rotate: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <CameraIcon className="h-5 w-5" />
              </motion.span>
            </Button>

            {/* Admin Access */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white/5 transition-all">
                  <motion.span whileHover={premiumHeader ? { scale: 1.06, rotate: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <CameraIcon className="h-5 w-5" />
                  </motion.span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/admin/login')}>
                  <span className="font-semibold">Admin Login</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search bar */}
            <form onSubmit={handleSearch} className={cn(
              "relative transition-all duration-300",
              isSearchExpanded ? "w-64" : "w-10"
            )}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search cameras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-9 transition-all duration-300 rounded-lg bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70",
                  !isSearchExpanded && "opacity-0 pointer-events-none"
                )}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.value) {
                    setIsSearchExpanded(false);
                  }
                }}
              />
              {!isSearchExpanded && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchExpanded(true)}
                  className="rounded-lg hover:bg-white/5 transition-all"
                >
                  <motion.span whileHover={premiumHeader ? { scale: 1.06, rotate: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <Search className="h-5 w-5" />
                  </motion.span>
                </Button>
              )}
            </form>

            {/* Wishlist button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden md:flex rounded-lg hover:bg-white/5 transition-all"
              onClick={() => navigate('/wishlist')}
            >
              <motion.span whileHover={premiumHeader ? { scale: 1.06, rotate: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Heart className="h-5 w-5" />
              </motion.span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Button>

            {/* Compare button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden md:flex rounded-lg hover:bg-white/5 transition-all"
              onClick={() => navigate('/compare')}
            >
              <motion.span whileHover={premiumHeader ? { scale: 1.06, rotate: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <GitCompare className="h-5 w-5" />
              </motion.span>
              {compareItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {compareItems.length}
                </span>
              )}
            </Button>

            {/* Account dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex rounded-lg hover:bg-white/5 transition-all">
                  <motion.span whileHover={premiumHeader ? { scale: 1.06, rotate: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <User className="h-5 w-5" />
                  </motion.span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/account')}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/account/orders')}>Orders</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/compare')}>Compare</DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <span className="font-semibold">Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/auth')}>Login / Sign Up</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-lg hover:bg-white/5 transition-all"
              onClick={() => openCart()}
            >
              <motion.span whileHover={premiumHeader ? { scale: 1.06, rotate: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <ShoppingCart className="h-5 w-5" />
              </motion.span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>

            <div className="hidden md:flex items-center gap-2 pl-2 ml-2 border-l border-border/40">
              <span className="text-xs text-muted-foreground">Premium UI</span>
              <Switch checked={premiumHeader} onCheckedChange={setPremiumHeader} />
            </div>
            <div className="hidden md:flex items-center gap-2 pl-2 ml-2 border-l border-border/40">
              <span className="text-xs text-muted-foreground">Theme</span>
              <Switch
                aria-label="Toggle dark mode"
                checked={theme === 'dark'}
                onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, shown when the toggle is clicked */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/80 backdrop-blur-xl">
          <div className="max-w-[1400px] mx-auto px-6 py-3 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="mobile-theme-switch" className="text-xs text-muted-foreground">Theme</Label>
              <Switch
                id="mobile-theme-switch"
                aria-label="Toggle dark mode"
                checked={theme === 'dark'}
                onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="mobile-premium-switch" className="text-xs text-muted-foreground">Premium UI</Label>
              <Switch
                id="mobile-premium-switch"
                aria-label="Toggle premium header"
                checked={premiumHeader}
                onCheckedChange={setPremiumHeader}
              />
            </div>
          </div>
          <nav className="max-w-[1400px] mx-auto px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.href} className="rounded-lg border border-border/50 overflow-hidden">
                {item.megaMenu ? (
                  <details className="group">
                    <summary className="list-none">
                      <Button variant="ghost" className="w-full justify-between text-sm font-medium px-3 py-2">
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </Button>
                    </summary>
                    <div className="px-3 pb-3 space-y-2">
                      {item.megaMenu.columns.map((column) => (
                        <div key={column.title}>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">{column.title}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {column.links.map((link) => (
                              <Link key={link.href} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-sm rounded-md px-2 py-1.5 hover:bg-accent/20">
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm font-medium px-3 py-2">
                      {item.label}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
