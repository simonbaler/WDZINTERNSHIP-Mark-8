import { useState } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateTextContent } from '@/lib/gemini';
import { Label } from '@/components/ui/label';

export default function AICopywriter() {
  const products = useProductsStore((s) => s.products);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const [selectedId, setSelectedId] = useState<string>('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const selected = products.find((p) => p.id === selectedId);

  const handleGenerate = async () => {
    if (!selected) {
      toast.error('Select a product first');
      return;
    }
    setLoading(true);
    try {
      const prompt = `Rewrite a compelling, SEO-friendly product description for an online camera store. Include key specs and benefits. Keep it under 140 words.\nProduct: ${selected.name}\nBrand: ${selected.brand}\nCategory: ${selected.category}\nCurrent description: ${selected.description}`;
      const text = await generateTextContent(prompt, selected.images?.[0]);
      setDraft(text || '');
      toast.success('Generated description');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!selected) return;
    updateProduct(selected.id, { description: draft });
    toast.success('Description updated');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Copywriter</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Product Description</CardTitle>
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
              <Button onClick={handleGenerate} disabled={loading || !selectedId} className="w-full">{loading ? 'Generating...' : 'Generate'}</Button>
            </div>
          </div>
          <div>
            <Label>Draft Description</Label>
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={8} placeholder="Generated description will appear here" />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleApply} disabled={!draft || !selectedId}>Apply to Product</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}