import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  slug: string;
  name: string;
  children: Category[];
}

export function CategoryNav() {
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
    <nav className="border-b border-border bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {categories.map((category) => (
            <CategoryMenuItem key={category.id} category={category} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function CategoryMenuItem({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <Link to={`/collections/${category.slug}`}>
        <Button 
          variant="ghost" 
          className="text-sm font-medium whitespace-nowrap"
          onMouseEnter={() => category.children.length > 0 && setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {category.name}
          {category.children.length > 0 && <ChevronRight className="ml-1 h-3 w-3" />}
        </Button>
      </Link>

      {category.children.length > 0 && isOpen && (
        <div 
          className="absolute top-full left-0 z-50 bg-background border border-border rounded-md shadow-lg p-4 min-w-[200px]"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="space-y-1">
            {category.children.map((child) => (
              <Link 
                key={child.id} 
                to={`/collections/${category.slug}/${child.slug}`}
                className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
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
          {categories.map((category) => (
            <div key={category.id}>
              <Link to={`/collections/${category.slug}`}>
                <h3 className="font-semibold text-sm mb-2 hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
              {category.children.length > 0 && (
                <div className="ml-4 space-y-1">
                  {category.children.map((child) => (
                    <Link 
                      key={child.id} 
                      to={`/collections/${category.slug}/${child.slug}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
