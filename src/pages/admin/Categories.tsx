import { useState } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { useCategoriesStore } from '@/store/categoriesStore';
import AdminCategoriesManagement from './CategoryManagement';

export default function AdminCategories() {
  const products = useProductsStore((s) => s.products);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const { categories } = useCategoriesStore();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Product['category']>('camera');

  const handleAssignCategory = () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }
    updateProduct(selectedProductId, { category: selectedCategory });
    toast.success('Category updated');
    setSelectedProductId('');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Manage Categories</TabsTrigger>
          <TabsTrigger value="assign">Assign Products</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <AdminCategoriesManagement />
        </TabsContent>

        <TabsContent value="assign" className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Assign Product Categories</h1>
            <p className="text-muted-foreground mt-2">Assign products to existing categories</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Bulk Category Assignment</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Product</label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Select Category</label>
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Product['category'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.slug}>
                        {c.icon} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAssignCategory} disabled={!selectedProductId} className="w-full md:w-auto">
                  Assign Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}