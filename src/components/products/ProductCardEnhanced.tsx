import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductImages } from '@/lib/useProductImages';
import { Product } from '@/types/product';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ProductCardEnhancedProps {
  product: Product;
}

export function ProductCardEnhanced({ product }: ProductCardEnhancedProps) {
  const { getProductImages } = useProductImages();
  const [displayImages, setDisplayImages] = useState(product.images);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const enhanced = getProductImages(product.slug, product.images);
    setDisplayImages(enhanced);
  }, [product.slug, product.images, getProductImages]);

  const currentImage = displayImages[currentImageIndex] || displayImages[0];

  return (
    <div className="group relative bg-card rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
          <OptimizedImage
            src={currentImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges?.includes('hot') && (
              <Badge variant="destructive" className="text-xs">🔥 Hot</Badge>
            )}
            {product.badges?.includes('new') && (
              <Badge variant="secondary" className="text-xs">✨ New</Badge>
            )}
            {product.badges?.includes('sale') && (
              <Badge variant="default" className="text-xs bg-green-500">💰 Sale</Badge>
            )}
          </div>

          {/* Quick View */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="sm" variant="secondary">
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>

          {/* Image Dots */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {displayImages.slice(0, 4).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating || 4.5}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold">
            ₹{(product.price / 100).toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.lowStock ? (
          <p className="text-xs text-orange-500 mb-3">⚠️ Low Stock</p>
        ) : product.inStock ? (
          <p className="text-xs text-green-500 mb-3">✓ In Stock</p>
        ) : (
          <p className="text-xs text-red-500 mb-3">✗ Out of Stock</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" disabled={!product.inStock}>
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
          <Button size="sm" variant="outline">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
