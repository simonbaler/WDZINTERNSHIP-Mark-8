import { ProductCard } from '@/components/products/ProductCard';
import { useProductsStore } from '@/store/productsStore';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function Cameras() {
  const products = useProductsStore((s) => s.products);
  const isLoading = false;
  const error = null;
  
  // Filter by category for consistency with admin-added products
  const cameras = products?.filter(p => p.category === 'camera') || [];

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cameras</h1>
          <p className="text-muted-foreground">
            Professional mirrorless and DSLR cameras for every photographer
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Error loading cameras. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Cameras</h1>
        <p className="text-muted-foreground">
          Professional mirrorless and DSLR cameras for every photographer
        </p>
      </div>

      {cameras.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cameras.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No cameras available at the moment.</p>
        </div>
      )}
    </div>
  );
}
