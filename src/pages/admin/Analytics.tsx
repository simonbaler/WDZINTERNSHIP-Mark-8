import { useMemo } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminAnalytics() {
  const products = useProductsStore((s) => s.products);

  const stats = useMemo(() => {
    const total = products.length;
    const avgPrice = total ? products.reduce((sum, p) => sum + p.price, 0) / total : 0;
    const topRated = products.slice().sort((a, b) => b.rating - a.rating).slice(0, 3);
    const byCategory = products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    return { total, avgPrice, byCategory, topRated };
  }, [products]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Store Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Total Products</div>
              <div className="text-2xl font-semibold">{stats.total}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Average Price</div>
              <div className="text-2xl font-semibold">${stats.avgPrice.toFixed(2)}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Categories</div>
              <div className="text-lg">{Object.entries(stats.byCategory).map(([k, v]) => `${k}: ${v}`).join(' • ') || '—'}</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2">Top Rated</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stats.topRated.map((p) => (
                <div key={p.id} className="border rounded p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm">{p.rating.toFixed(1)}★ • ${p.price.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}