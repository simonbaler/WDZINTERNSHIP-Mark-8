import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export interface CategoryFilters {
  category?: string;
  sub?: string;
  brand?: string;
  price_min?: string;
  price_max?: string;
  sort?: string;
  page?: string;
}

export function useCategoryRouteState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CategoryFilters = {
    category: searchParams.get('category') || undefined,
    sub: searchParams.get('sub') || undefined,
    brand: searchParams.get('brand') || undefined,
    price_min: searchParams.get('price_min') || undefined,
    price_max: searchParams.get('price_max') || undefined,
    sort: searchParams.get('sort') || 'relevance',
    page: searchParams.get('page') || '1',
  };

  const updateFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset page when filters change (unless page is being explicitly set)
    if (!('page' in newFilters)) {
      params.set('page', '1');
    }

    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    const category = searchParams.get('category');
    const sub = searchParams.get('sub');
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sub) params.set('sub', sub);
    params.set('sort', 'relevance');
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  return { filters, updateFilters, clearFilters };
}
