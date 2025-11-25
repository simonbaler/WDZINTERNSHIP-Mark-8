import { useState, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductsStore } from '@/store/productsStore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SemanticSearch } from '@/components/search/SemanticSearch';
import { VisualSearch } from '@/components/search/VisualSearch';

export default function Search() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  
  // Check if we have semantic/visual search results
  const semanticResults = location.state?.results;
  const searchType = location.state?.searchType;
  
  const storeProducts = useProductsStore((s) => s.products);
  const products = semanticResults || storeProducts;
  const isLoading = false;

  // Generate search keywords from products
  const searchKeywords = useMemo(() => {
    const keywords = new Set<string>();
    products.forEach(product => {
      product.name?.split(' ').forEach(word => keywords.add(word.toLowerCase()));
      product.brand && keywords.add(product.brand.toLowerCase());
      if (product.specs) {
        Object.values(product.specs).forEach(val => {
          if (typeof val === 'string') {
            val.split(' ').forEach(word => keywords.add(word.toLowerCase()));
          }
        });
      }
    });
    return Array.from(keywords).filter(k => k.length > 2).slice(0, 20);
  }, [products]);

  // If semantic results, use them directly, otherwise filter
  const filteredProducts = semanticResults 
    ? semanticResults.map((r: any) => ({
        id: r.product_data.id,
        name: r.product_data.name,
        brand: r.product_data.brand,
        price: r.product_data.price,
        images: r.product_data.images || [],
        slug: r.product_data.slug,
        similarity: r.similarity
      }))
    : products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const suggestedKeywords = searchKeywords
    .filter(k => k.includes(searchTerm.toLowerCase()) && k !== searchTerm.toLowerCase())
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Search</h1>
          
          <div className="space-y-4">
            <div className="flex gap-2 max-w-2xl">
              <SemanticSearch />
              <VisualSearch />
            </div>
            
            {searchType && (
              <Badge variant="secondary">
                {searchType === 'semantic' ? '🧠 AI Semantic Search' : '🖼️ Visual Search'}
              </Badge>
            )}
            
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search cameras, lenses, accessories..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Keyword Suggestions */}
            {searchTerm && suggestedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Suggestions:</span>
                {suggestedKeywords.map((keyword) => (
                  <Badge 
                    key={keyword} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setSearchTerm(keyword)}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        )}

        {searchTerm && (
          <p className="text-muted-foreground mb-6">
            {filteredProducts.length} results for "{searchTerm}"
          </p>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
