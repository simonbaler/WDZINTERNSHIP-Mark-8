import { motion } from 'framer-motion';
import { X, Grid2x2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompareStore } from '@/store/compareStore';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

export default function Compare() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'cards' | 'table'>('cards');

  const specs = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p: any) => {
      if (p?.specs && typeof p.specs === 'object') {
        Object.keys(p.specs).forEach((k) => set.add(k));
      }
    });
    return Array.from(set);
  }, [items]);

  const anyDietary = items.some((p: any) => Array.isArray(p?.dietary) && p.dietary.length > 0);

  if (!items || items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold">No products to compare</h2>
          <p className="text-sm text-muted-foreground mt-2">Add products to the comparison list to see them side-by-side.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Compare Products</h1>
          <p className="text-sm text-muted-foreground">Compare features, ratings, price and dietary info.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewType === 'cards' ? 'default' : 'ghost'} size="sm" onClick={() => setViewType('cards')} title="Cards view">
            <Grid2x2 className="mr-2 h-4 w-4" /> Cards
          </Button>
          <Button variant={viewType === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setViewType('table')} title="Table view">
            <List className="mr-2 h-4 w-4" /> Table
          </Button>
          <Button variant="destructive" size="sm" onClick={() => clearCompare()} title="Clear compare list">
            Clear
          </Button>
        </div>
      </div>

      {viewType === 'cards' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product: any) => (
            <motion.div key={product.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4 flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <img src={product.images?.[0]} alt={product.name} className="w-28 h-28 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <div className="mt-3">
                      <div className="text-2xl font-bold">₹{product.price?.toLocaleString?.() ?? product.price}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{product.rating ? product.rating.toFixed(1) : '—'}</span>
                    <span className="text-sm text-muted-foreground">({product.reviewCount ?? 0} reviews)</span>
                  </div>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    <Badge variant={product.inStock ? 'default' : 'destructive'}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
                    <Badge variant="outline" className="capitalize">{product.category}</Badge>
                    {product.badges?.map((b: string) => (
                      <Badge key={b} variant="secondary" className="capitalize">{b}</Badge>
                    ))}
                  </div>

                  {product.dietary && product.dietary.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Type</p>
                      <div className="flex gap-1 flex-wrap">
                        {product.dietary.map((diet: string) => (
                          <Badge key={diet} variant="secondary" className="text-xs capitalize">{diet}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.specs && Object.keys(product.specs).length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Specifications</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {Object.entries(product.specs).slice(0, 6).map(([k, v]) => (
                          <div key={k} className="capitalize">
                            <span className="font-medium text-foreground">{k}:</span> <span className="ml-1">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button className="flex-1" onClick={() => navigate(`/product/${product.slug}`)}>View Details</Button>
                  <Button size="icon" variant="ghost" onClick={() => removeFromCompare(product.id)} title="Remove">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {viewType === 'table' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto border rounded-lg">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 font-semibold">Product</th>
                <th className="text-right p-4 font-semibold">Price</th>
                <th className="text-center p-4 font-semibold">Rating</th>
                <th className="text-center p-4 font-semibold">Reviews</th>
                <th className="text-center p-4 font-semibold">Stock</th>
                <th className="text-center p-4 font-semibold">Category</th>
                {anyDietary && <th className="text-left p-4 font-semibold">Type</th>}
                {specs.map((s) => (
                  <th key={s} className="text-left p-4 font-semibold capitalize">{s}</th>
                ))}
                <th className="text-center p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((product: any, idx: number) => (
                <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="border-b hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0]} alt={product.name} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold">₹{product.price?.toLocaleString?.() ?? product.price}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{product.rating ? product.rating.toFixed(1) : '—'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-muted text-sm font-medium">{product.reviewCount ?? 0}</span>
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant={product.inStock ? 'default' : 'destructive'}>{product.inStock ? 'Yes' : 'No'}</Badge>
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant="outline" className="capitalize">{product.category}</Badge>
                  </td>
                  {anyDietary && (
                    <td className="p-4">
                      {product.dietary && product.dietary.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {product.dietary.map((d: string) => (
                            <Badge key={d} variant="secondary" className="text-xs capitalize">{d}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  )}
                  {specs.map((s) => (
                    <td key={s} className="p-4 text-sm text-muted-foreground">{product.specs?.[s] ?? '—'}</td>
                  ))}
                  <td className="p-4 text-center">
                    <Button size="icon" variant="ghost" onClick={() => removeFromCompare(product.id)} title="Remove from compare">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
