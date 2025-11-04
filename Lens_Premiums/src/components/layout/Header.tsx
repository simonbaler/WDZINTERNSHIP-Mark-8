import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, Home, LogOut, Mic } from 'lucide-react';
import { ImageSearchModal } from '../search/ImageSearchModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

export const Header = () => {
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAdmin, signOut: authSignOut } = useAuth();
  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

  // keyboard shortcut: focus search on '/'
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && (document.activeElement as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = async () => {
    await authSignOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center justify-center text-sm">
          <p>Free shipping over ₹4,999 — 30-day returns</p>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Home className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <div className="text-2xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    LENS
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              item.megaMenu ? (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium">
                      {item.label}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[600px] p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {item.megaMenu.columns.map((column) => (
                        <div key={column.title}>
                          <h3 className="font-semibold mb-3">{column.title}</h3>
                          <div className="space-y-2">
                            {column.links.map((link) => (
                              <DropdownMenuItem key={link.href} asChild>
                                <Link to={link.href} className="w-full cursor-pointer">
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
                  <Button variant="ghost" className="text-sm font-medium">
                    {item.label}
                  </Button>
                </Link>
              )
            ))}
          </nav>

          {/* Right: Search, Account, Wishlist, Cart */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className={cn(
                "relative transition-all duration-300",
                isSearchExpanded ? "w-64" : "w-10"
              )}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  ref={searchRef}
                  type="search"
                  placeholder="Search cameras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "pl-9 transition-all duration-300",
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
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </form>
              <ImageSearchModal />
            </div>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden md:flex"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Button>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
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

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              id="cart-button"
              className="relative"
              onClick={() => openCart()}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="max-w-[1400px] mx-auto px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
