import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterPanel } from '@/components/category/FilterPanel';
import { Breadcrumbs } from '@/components/category/Breadcrumbs';
import { QuickSort } from '@/components/category/QuickSort';
import { useCategoryRouteState } from '@/hooks/useCategoryRouteState';
import { supabase } from '@/integrations/supabase/client';
import { Filter } from 'lucide-react';

export default function Collection() {
  const { categorySlug, subSlug } = useParams();
  const { filters } = useCategoryRouteState();
  const [products, setProducts] = useState<any[]>([]);
  const [facets, setFacets] = useState<any>(null);
  const [categoryMeta, setCategoryMeta] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    trackCategoryClick();
  }, [categorySlug, subSlug, filters]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categorySlug) params.set('category', categorySlug);
      if (subSlug) params.set('sub', subSlug);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const { data, error } = await supabase.functions.invoke('products-filter', {
        body: Object.fromEntries(params),
      });

      if (error) throw error;

      setProducts(data.products || []);
      setFacets(data.facets);
      setCategoryMeta(data.categoryMeta);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackCategoryClick = async () => {
    try {
      await supabase.functions.invoke('category-analytics', {
        body: {
          categorySlug: subSlug || categorySlug,
          eventType: 'category.clicked',
          metadata: { filters },
        },
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  const breadcrumbs = [
    { label: 'Collections', href: '/collections' },
    ...(categorySlug ? [{ label: categorySlug, href: `/collections/${categorySlug}` }] : []),
    ...(subSlug ? [{ label: subSlug }] : []),
  ];

  const pageTitle = categoryMeta?.title || `${subSlug || categorySlug || 'Collections'} — Camera Glaze Forge`;
  const pageDescription = categoryMeta?.description || 'Browse our collection of professional camera equipment';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://cameraglaze.com/collections/${categorySlug}${subSlug ? `/${subSlug}` : ''}`} />
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 capitalize">
              {subSlug || categorySlug || 'Collections'}
            </h1>
            {categoryMeta?.description && (
              <p className="text-muted-foreground">{categoryMeta.description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterPanel facets={facets} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {total} {total === 1 ? 'product' : 'products'}
              </p>
              <div className="flex items-center gap-4">
                <QuickSort />
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterPanel facets={facets} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[400px]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your filters.</p>
                <Button variant="link" onClick={() => window.location.href = '/collections'}>
                  View all collections
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
