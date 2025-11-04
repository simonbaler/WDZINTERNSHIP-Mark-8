import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { mockProducts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';

export default function Cameras() {
  const location = useLocation();
  const { data: apiProducts, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [products, setProducts] = useState([]);

  // Get category from URL path
  useEffect(() => {
    const path = location.pathname.substring(1); // Remove leading slash
    if (path === 'cameras') {
      setActiveCategory('cameras');
    } else if (path === 'lenses') {
      setActiveCategory('lenses');
    } else if (path === 'accessories') {
      setActiveCategory('accessories');
    } else {
      setActiveCategory('all');
    }
    setActiveSubcategory('all');
  }, [location.pathname]);

  // Filter products based on category and subcategory
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      let filtered = apiProducts;
      
      // Filter by category
      if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategory);
      }
      
      // Filter by subcategory
      if (activeSubcategory !== 'all') {
        filtered = filtered.filter(p => p.subcategory === activeSubcategory);
      }
      
      setProducts(filtered);
    } else {
      // Fallback to mockProducts if API data is not available
      let filtered = mockProducts;
      
      if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategory);
      }
      
      setProducts(filtered);
    }
  }, [apiProducts, activeCategory, activeSubcategory]);

  // Get unique subcategories for the active category
  const subcategories = apiProducts 
    ? [...new Set(apiProducts.filter(p => p.category === activeCategory).map(p => p.subcategory))]
    : [];

  // Page title based on category
  const getPageTitle = () => {
    switch(activeCategory) {
      case 'cameras': return 'Cameras';
      case 'lenses': return 'Lenses';
      case 'accessories': return 'Accessories';
      default: return 'All Products';
    }
  };

  // Page description based on category
  const getPageDescription = () => {
    switch(activeCategory) {
      case 'cameras': return 'Professional mirrorless and DSLR cameras for every photographer';
      case 'lenses': return 'High-quality lenses for all camera systems';
      case 'accessories': return 'Essential accessories for your photography gear';
      default: return 'Browse our complete collection of photography equipment';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{getPageTitle()}</h1>
        <p className="text-muted-foreground">
          {getPageDescription()}
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          onClick={() => {
            setActiveCategory('all');
            setActiveSubcategory('all');
          }}
        >
          All Products
        </Button>
        <Button 
          variant={activeCategory === 'cameras' ? 'default' : 'outline'}
          onClick={() => {
            setActiveCategory('cameras');
            setActiveSubcategory('all');
          }}
        >
          Cameras
        </Button>
        <Button 
          variant={activeCategory === 'lenses' ? 'default' : 'outline'}
          onClick={() => {
            setActiveCategory('lenses');
            setActiveSubcategory('all');
          }}
        >
          Lenses
        </Button>
        <Button 
          variant={activeCategory === 'accessories' ? 'default' : 'outline'}
          onClick={() => {
            setActiveCategory('accessories');
            setActiveSubcategory('all');
          }}
        >
          Accessories
        </Button>
      </div>

      {/* Subcategory filters - only show if subcategories exist */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeSubcategory === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveSubcategory('all')}
            size="sm"
          >
            All {activeCategory}
          </Button>
          {subcategories.map(subcategory => (
            <Button 
              key={subcategory}
              variant={activeSubcategory === subcategory ? 'default' : 'outline'}
              onClick={() => setActiveSubcategory(subcategory)}
              size="sm"
            >
              {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
            </Button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No products found in this category.</p>
          <Button onClick={() => {
            setActiveCategory('all');
            setActiveSubcategory('all');
          }}>
            View All Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
