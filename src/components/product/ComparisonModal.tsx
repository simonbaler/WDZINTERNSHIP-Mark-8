import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCompareStore } from '@/store/compareStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal = ({ isOpen, onClose }: ComparisonModalProps) => {
  const { items: compareItems, removeFromCompare } = useCompareStore();
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    'price',
    'rating',
    'brand',
    'inStock',
  ]);

  if (compareItems.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Product Comparison</DialogTitle>
          </DialogHeader>
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No products to compare</p>
            <p className="text-sm text-muted-foreground">
              Add products from the product listing or quick view to compare them.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const allAttributes = new Set<string>();
  compareItems.forEach((product) => {
    if (product.specs) {
      Object.keys(product.specs).forEach(key => allAttributes.add(key));
    }
  });

  const attributesToShow = ['price', 'rating', 'brand', 'inStock', ...Array.from(allAttributes)];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Products ({compareItems.length})</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-6">
          {/* Product Images and Names */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareItems.length + 1}, 1fr)` }}>
            <div className="font-semibold text-sm">Specifications</div>
            <AnimatePresence>
              {compareItems.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => removeFromCompare(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {product.images[0] && (
                    <div className="aspect-square bg-muted rounded-md overflow-hidden">
                      <OptimizedImage
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Attributes Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {attributesToShow.map((attribute) => (
                    <tr key={attribute} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="font-semibold px-4 py-3 bg-muted/30 min-w-[150px]">
                        {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                      </td>
                      {compareItems.map((product) => (
                        <td key={product.id} className="px-4 py-3 text-center border-l">
                          {renderAttributeValue(product, attribute)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close Comparison
            </Button>
            <Button onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function renderAttributeValue(product: Product, attribute: string): React.ReactNode {
  switch (attribute) {
    case 'price':
      return (
        <div className="font-semibold">
          ₹{(product.price / 100).toLocaleString('en-IN')}
        </div>
      );
    case 'originalPrice':
      return product.originalPrice ? (
        <div className="text-sm line-through text-muted-foreground">
          ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    case 'rating':
      return (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{product.rating || 0}</span>
        </div>
      );
    case 'brand':
      return <span>{product.brand || '-'}</span>;
    case 'inStock':
      return (
        <span className={product.inStock ? 'text-green-600 font-medium' : 'text-destructive font-medium'}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      );
    case 'reviewCount':
      return <span>{product.reviewCount || 0} reviews</span>;
    case 'category':
      return <span className="capitalize">{product.category}</span>;
    default:
      if (product.specs && product.specs[attribute]) {
        return <span>{product.specs[attribute]}</span>;
      }
      return <span className="text-muted-foreground">-</span>;
  }
}
