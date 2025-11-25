import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useCategoryRouteState } from '@/hooks/useCategoryRouteState';
import { Separator } from '@/components/ui/separator';

interface FilterPanelProps {
  facets?: {
    brand?: Array<{ value: string; count: number }>;
    priceRanges?: Array<{ min: number; max: number; count: number }>;
  };
}

export function FilterPanel({ facets }: FilterPanelProps) {
  const { filters, updateFilters, clearFilters } = useCategoryRouteState();

  const handleBrandChange = (brand: string, checked: boolean) => {
    updateFilters({ brand: checked ? brand : undefined });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    updateFilters({ 
      price_min: min > 0 ? String(min) : undefined,
      price_max: max < 999999 ? String(max) : undefined,
    });
  };

  const activeFilterCount = [
    filters.brand,
    filters.price_min,
    filters.price_max,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.brand && (
            <Badge variant="secondary" className="gap-1">
              {filters.brand}
              <button onClick={() => updateFilters({ brand: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(filters.price_min || filters.price_max) && (
            <Badge variant="secondary" className="gap-1">
              ₹{filters.price_min || 0} - ₹{filters.price_max || '∞'}
              <button onClick={() => updateFilters({ price_min: undefined, price_max: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      <Separator />

      {/* Brand Filters */}
      {facets?.brand && facets.brand.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Brand</h3>
          <div className="space-y-2">
            {facets.brand.map((brand) => (
              <div key={brand.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.value}`}
                  checked={filters.brand === brand.value}
                  onCheckedChange={(checked) => handleBrandChange(brand.value, checked as boolean)}
                />
                <Label htmlFor={`brand-${brand.value}`} className="text-sm cursor-pointer flex-1">
                  {brand.value} ({brand.count})
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Price Range */}
      {facets?.priceRanges && facets.priceRanges.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-3">
            {facets.priceRanges.map((range) => (
              <Button
                key={`${range.min}-${range.max}`}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handlePriceRangeChange(range.min, range.max)}
              >
                ₹{range.min.toLocaleString()} - ₹{range.max.toLocaleString()} ({range.count})
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
