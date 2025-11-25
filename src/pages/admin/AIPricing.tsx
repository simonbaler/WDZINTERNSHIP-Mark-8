import { useState } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { generateTextContent } from '@/lib/gemini';

function extractPrice(text: string): number | null {
  const match = text.match(/\$?\s*(\d+[\d,.]*)/);
  if (!match) return null;
  const num = parseFloat(match[1].replace(/,/g, ''));
  return isNaN(num) ? null : num;
}

export default function AIPricing() {
  const products = useProductsStore((s) => s.products);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const [selectedId, setSelectedId] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const selected = products.find((p) => p.id === selectedId);

  const handleSuggest = async () => {
    if (!selected) {
      toast.error('Select a product first');
      return;
    }
    setLoading(true);
    try {
      const specs = Object.entries(selected.specs || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      const prompt = `Given this product and specs, suggest a fair retail price in USD for an online camera store. Return a short justification followed by a single price figure.\nProduct: ${selected.name}\nBrand: ${selected.brand}\nCategory: ${selected.category}\nSpecs: ${specs}\nCurrent price: $${selected.price.toFixed(2)}`;
      const text = await generateTextContent(prompt, selected.images?.[0]);
      setSuggestion(text || '');
      const parsed = text ? extractPrice(text) : null;
      if (parsed != null) setPrice(parsed.toFixed(2));
      toast.success('Price suggestion ready');
    } catch (e) {
      toast.error('Suggestion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!selected || !price) return;
    const newPrice = parseFloat(price);
    if (isNaN(newPrice)) {
      toast.error('Invalid price');
      return;
    }
    updateProduct(selected.id, { price: newPrice });
    toast.success('Price updated');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Pricing Assistant</h1>
      <Card>
        <CardHeader>
          <CardTitle>Suggest Product Price</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Product</Label>
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
            <div className="flex items-end">
              <Button onClick={handleSuggest} disabled={loading || !selectedId} className="w-full">{loading ? 'Analyzing...' : 'Suggest Price'}</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Suggestion</Label>
            <div className="rounded border p-3 text-sm whitespace-pre-wrap min-h-[80px]">{suggestion || 'No suggestion yet'}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label>Apply Price (USD)</Label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 999.00" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button onClick={handleApply} disabled={!price || !selectedId}>Apply to Product</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}