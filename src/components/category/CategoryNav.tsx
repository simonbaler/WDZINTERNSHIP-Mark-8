import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  color?: string;
  children: Category[];
}

export function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [categories]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('categories-list');
      if (error) throw error;
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) return null;

  return (
    <nav className="border-b border-border bg-gradient-to-r from-background via-muted/20 to-background sticky top-16 z-40">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-2 py-2">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="flex-shrink-0 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}

          {/* Categories Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1 overflow-x-auto py-2 flex-1 scroll-smooth"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((category, index) => (
              <CategoryMenuItem
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onSelect={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="flex-shrink-0 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}

function CategoryMenuItem({ 
  category, 
  isSelected, 
  onSelect 
}: { 
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group flex-shrink-0">
      <Link to={`/collections/${category.slug}`} onClick={onSelect}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button
            variant={isSelected ? 'default' : 'ghost'}
            className={`text-sm font-medium whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'hover:bg-muted'
            }`}
            onMouseEnter={() => category.children.length > 0 && setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.name}
            {category.children.length > 0 && <ChevronRight className="ml-1 h-3 w-3" />}
          </Button>
        </motion.div>
      </Link>

      {/* Dropdown Menu */}
      {category.children.length > 0 && isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-full left-0 z-50 bg-background border border-border rounded-md shadow-lg p-4 min-w-[200px] mt-2"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="space-y-1">
            {category.children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/collections/${category.slug}/${child.slug}`}
                  className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors hover:translate-x-1 transform"
                >
                  {child.icon && <span className="mr-2">{child.icon}</span>}
                  {child.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function MobileCategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('categories-list');
      if (error) throw error;
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">Categories</Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/collections/${category.slug}`}>
                <motion.h3
                  whileHover={{ x: 4 }}
                  className="font-semibold text-sm mb-2 hover:text-primary transition-colors"
                >
                  {category.icon && <span className="mr-2">{category.icon}</span>}
                  {category.name}
                </motion.h3>
              </Link>
              {category.children.length > 0 && (
                <div className="ml-4 space-y-1">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      to={`/collections/${category.slug}/${child.slug}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    >
                      {child.icon && <span className="mr-2">{child.icon}</span>}
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
