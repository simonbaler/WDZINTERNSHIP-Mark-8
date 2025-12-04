import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductsStore } from '@/store/productsStore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SemanticSearch } from '@/components/search/SemanticSearch';
import { VisualSearch } from '@/components/search/VisualSearch';
import { useAISearch, filterProductsByAIInterpretation } from '@/lib/aiSearch';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function Search() {
  const products = useProductsStore((s) => s.products);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [aiResult, setAiResult] = useState<{ interpretation: string; suggestions: string[]; relatedTerms: string[] } | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const semanticResults = location.state?.results as any[] | undefined;
  const [filters, setFilters] = useState<{ brand?: string; category?: string; priceMin?: number; priceMax?: number }>({});

  useEffect(() => {
    if (searchTerm && searchTerm.length > 2) {
      setIsLoadingAI(true);
      useAISearch(searchTerm)
        .then((res) => {
          setAiResult(res);
          setIsLoadingAI(false);
        })
        .catch(() => setIsLoadingAI(false));
    } else {
      setAiResult(null);
    }
  }, [searchTerm]);

  const facets = useMemo(() => {
    const brandCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const priceRanges = [
      { min: 0, max: 50000 },
      { min: 50000, max: 100000 },
      { min: 100000, max: 200000 },
      { min: 200000, max: 999999 },
    ].map((r) => ({
      ...r,
      count: products.filter((p) => (p.price || 0) >= r.min && (p.price || 0) <= r.max).length,
    }));
    return {
      brands: Object.entries(brandCounts).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count),
      categories: Object.entries(categoryCounts).map(([value, count]) => ({ value, count })),
      priceRanges,
    };
  }, [products]);

  const baseResults = useMemo(() => {
    if (Array.isArray(semanticResults) && semanticResults.length > 0) {
      return semanticResults.map((r: any) => r.product_data || r);
    }
    if (!searchTerm) return products;
    const q = searchTerm.toLowerCase();
    return products.filter((p) =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }, [semanticResults, products, searchTerm]);

  const filteredProducts = useMemo(() => {
    let res = baseResults;
    if (aiResult?.interpretation) {
      res = filterProductsByAIInterpretation(res, aiResult.interpretation);
    }
    return res.filter((product: any) => {
      const matchesBrand = filters.brand ? product.brand === filters.brand : true;
      const matchesCategory = filters.category ? product.category === filters.category : true;
      const matchesPriceMin = filters.priceMin != null ? (product.price || 0) >= filters.priceMin : true;
      const matchesPriceMax = filters.priceMax != null ? (product.price || 0) <= filters.priceMax : true;
      return matchesBrand && matchesCategory && matchesPriceMin && matchesPriceMax;
    });
  }, [baseResults, aiResult, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search cameras, lenses, accessories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <SemanticSearch />
          <VisualSearch />
        </div>
      </div>

      {aiResult && (
        <Card className="p-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">AI Interpretation</p>
              <p className="text-sm mt-1">{aiResult.interpretation}</p>
            </div>
            {isLoadingAI && <span className="text-xs text-muted-foreground">Loading...</span>}
          </div>
          {aiResult.suggestions.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {aiResult.suggestions.map((s) => (
                <Badge key={s} variant="secondary" onClick={() => setSearchTerm(s)} className="cursor-pointer">
                  {s}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Card className="p-4">
            <p className="text-sm font-medium mb-3">Brand</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {facets.brands.map((b) => (
                <Badge
                  key={b.value}
                  variant={filters.brand === b.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilters((f) => ({ ...f, brand: f.brand === b.value ? undefined : b.value }))}
                >
                  {b.value} ({b.count})
                </Badge>
              ))}
            </div>

            <p className="text-sm font-medium mb-3">Category</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {facets.categories.map((c) => (
                <Badge
                  key={c.value}
                  variant={filters.category === c.value ? 'default' : 'outline'}
                  className="capitalize cursor-pointer"
                  onClick={() => setFilters((f) => ({ ...f, category: f.category === c.value ? undefined : c.value }))}
                >
                  {c.value}
                </Badge>
              ))}
            </div>

            <p className="text-sm font-medium mb-3">Price</p>
            <div className="flex gap-2 flex-wrap">
              {facets.priceRanges.map((r) => (
                <Badge
                  key={`${r.min}-${r.max}`}
                  variant={filters.priceMin === r.min && filters.priceMax === r.max ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      priceMin: f.priceMin === r.min && f.priceMax === r.max ? undefined : r.min,
                      priceMax: f.priceMin === r.min && f.priceMax === r.max ? undefined : r.max,
                    }))
                  }
                >
                  ₹{r.min.toLocaleString()} - ₹{r.max.toLocaleString()} ({r.count})
                </Badge>
              ))}
            </div>
          </Card>
        </aside>

        <div className="lg:col-span-3">
          {searchTerm && (
            <p className="text-muted-foreground mb-4">
              {filteredProducts.length} results for "{searchTerm}"
            </p>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No results found</h2>
              <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
