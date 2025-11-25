// Import necessary components and icons
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, Youtube, Twitter, Facebook } from 'lucide-react';

// Define the links for the footer section
const footerLinks = {
  shop: [
    { label: 'Cameras', href: '/cameras' },
    { label: 'Lenses', href: '/lenses' },
    { label: 'Accessories', href: '/accessories' },
    { label: 'Bundles', href: '/bundles' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Warranty', href: '/warranty' },
    { label: 'FAQ', href: '/faq' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
};

// The Footer component, displayed at the bottom of every page
export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Newsletter subscription form */}
        <div className="mb-12 text-center max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">Stay in Focus</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get exclusive deals, new releases, and photography tips.
          </p>
          <div className="flex gap-2">
            <Input type="email" placeholder="Enter your email" />
            <Button variant="default">Subscribe</Button>
          </div>
        </div>

        {/* Grid of footer links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar with copyright and legal links */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 LENS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
