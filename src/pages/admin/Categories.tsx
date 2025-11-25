import { useMemo, useState } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Product } from '@/types/product';

export default function AdminCategories() {
  const products = useProductsStore((s) => s.products);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const [selectedId, setSelectedId] = useState<string>('');
  const [category, setCategory] = useState<Product['category']>('camera');

  const categories = useMemo<Product['category'][]>(() => ['camera', 'lens', 'accessory', 'bundle'], []);

  const handleApply = () => {
    if (!selectedId) return;
    updateProduct(selectedId, { category });
    toast.success('Category updated');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>
      <Card>
        <CardHeader>
          <CardTitle>Assign Category</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={category} onValueChange={(v) => setCategory(v as Product['category'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleApply} disabled={!selectedId}>Apply</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}