import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useCategoryRouteState } from '@/hooks/useCategoryRouteState';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

interface FilterPanelProps {
  facets?: {
    brand?: Array<{ value: string; count: number }>;
    priceRanges?: Array<{ min: number; max: number; count: number }>;
  };
}

// Dietary information options for products
const DIETARY_OPTIONS = [
  { id: 'professional', label: 'Professional Grade', value: 'professional' },
  { id: 'amateur', label: 'Beginner Friendly', value: 'amateur' },
  { id: 'compact', label: 'Compact/Portable', value: 'compact' },
  { id: 'vintage', label: 'Vintage', value: 'vintage' },
  { id: 'digital', label: 'Digital', value: 'digital' },
  { id: 'manual', label: 'Manual Mode', value: 'manual' },
];

export function FilterPanel({ facets }: FilterPanelProps) {
  const { filters, updateFilters, clearFilters } = useCategoryRouteState();
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(filters.price_min || '0', 10),
    parseInt(filters.price_max || '999999', 10),
  ]);
  const [selectedDietaryInfo, setSelectedDietaryInfo] = useState<string[]>([]);

  // Update price range when filters change
  useEffect(() => {
    setPriceRange([
      parseInt(filters.price_min || '0', 10),
      parseInt(filters.price_max || '999999', 10),
    ]);
  }, [filters.price_min, filters.price_max]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    updateFilters({ brand: checked ? brand : undefined });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    updateFilters({
      price_min: values[0] > 0 ? String(values[0]) : undefined,
      price_max: values[1] < 999999 ? String(values[1]) : undefined,
    });
  };

  const handleDietaryChange = (value: string, checked: boolean) => {
    const updated = checked
      ? [...selectedDietaryInfo, value]
      : selectedDietaryInfo.filter(d => d !== value);
    setSelectedDietaryInfo(updated);
  };

  const activeFilterCount = [
    filters.brand,
    filters.price_min,
    filters.price_max,
    selectedDietaryInfo.length > 0 ? 'dietary' : null,
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
          {selectedDietaryInfo.map(diet => (
            <Badge key={diet} variant="secondary" className="gap-1">
              {DIETARY_OPTIONS.find(d => d.value === diet)?.label}
              <button onClick={() => handleDietaryChange(diet, false)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      {/* Price Range Slider */}
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            min={0}
            max={999999}
            step={1000}
            className="w-full"
          />
          <div className="flex items-center justify-between gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Min</Label>
              <div className="text-sm font-semibold">₹{priceRange[0].toLocaleString()}</div>
            </div>
            <div className="text-xs text-muted-foreground">—</div>
            <div className="text-right">
              <Label className="text-xs text-muted-foreground">Max</Label>
              <div className="text-sm font-semibold">₹{priceRange[1].toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Product Type / Dietary Information */}
      <div>
        <h3 className="font-medium mb-3">Product Type</h3>
        <div className="space-y-2">
          {DIETARY_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`dietary-${option.id}`}
                checked={selectedDietaryInfo.includes(option.value)}
                onCheckedChange={(checked) => handleDietaryChange(option.value, checked as boolean)}
              />
              <Label htmlFor={`dietary-${option.id}`} className="text-sm cursor-pointer flex-1">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}
