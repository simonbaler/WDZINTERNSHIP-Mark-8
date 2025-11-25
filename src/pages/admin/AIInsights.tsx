import { useMemo, useState } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateTextContent } from '@/lib/gemini';

export default function AIInsights() {
  const products = useProductsStore((s) => s.products);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  const catalogSummary = useMemo(() => {
    const byCategory: Record<string, number> = {};
    let avgPrice = 0;
    products.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      avgPrice += p.price;
    });
    avgPrice = products.length ? avgPrice / products.length : 0;
    const topProducts = products
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
      .map((p) => `${p.name} (${p.rating.toFixed(1)}★, $${p.price.toFixed(0)})`)
      .join('; ');
    return {
      byCategory,
      avgPrice,
      topProducts,
      total: products.length,
    };
  }, [products]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `You are an ecommerce analyst. Based on this store catalog summary, provide 6 concise insights: trends, pricing, assortment gaps, potential bundles, and two actionable suggestions. Format as bullet points.\nSummary: ${JSON.stringify(catalogSummary)}`;
      const text = await generateTextContent(prompt);
      setInsights(text || '');
      toast.success('Insights ready');
    } catch (e) {
      toast.error('Insight generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Store Insights</h1>
        <Button onClick={handleGenerate} disabled={loading}>{loading ? 'Analyzing...' : 'Generate Insights'}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Catalog Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-64">{JSON.stringify(catalogSummary, null, 2)}</pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm whitespace-pre-wrap min-h-[120px]">{insights || 'No insights yet. Click Generate.'}</div>
        </CardContent>
      </Card>
    </div>
  );
}