import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

export default function Merchandising() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pinnedProducts, setPinnedProducts] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    }
  };

  const handlePinProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && !pinnedProducts.find(p => p.id === productId)) {
      setPinnedProducts([...pinnedProducts, { ...product, priority: pinnedProducts.length + 1 }]);
      toast.success('Product pinned');
    }
  };

  const handleUnpinProduct = (productId: string) => {
    setPinnedProducts(pinnedProducts.filter(p => p.id !== productId));
    toast.success('Product unpinned');
  };

  const saveMerchandising = async () => {
    toast.info('Merchandising saved (feature stub - database integration pending)');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Merchandising</h1>
        <p className="text-muted-foreground">Pin and prioritize products for categories</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Merchandising</CardTitle>
          <CardDescription>Select a category and pin products to feature at the top</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Select Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && (
            <>
              <div>
                <Label>Pinned Products</Label>
                <div className="space-y-2 mt-2">
                  {pinnedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Priority: {product.priority}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnpinProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {pinnedProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground">No products pinned yet</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Add Product to Pin</Label>
                <Select onValueChange={handlePinProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products
                      .filter(p => !pinnedProducts.find(pp => pp.id === p.id))
                      .map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ₹{product.price}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={saveMerchandising} className="w-full">
                Save Merchandising Configuration
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
