import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, GitCompare } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useProductImages } from '@/lib/useProductImages';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCompare, isInCompare } = useCompareStore();
  const { getProductImages } = useProductImages();
  const [displayImages, setDisplayImages] = useState(product.images);
  
  useEffect(() => {
    const enhanced = getProductImages(product.slug, product.images);
    setDisplayImages(enhanced);
  }, [product.slug, product.images, getProductImages]);
  
  const normalizedProduct = {
    ...product,
    images: displayImages
  };
  
  const isWishlisted = wishlistItems.some(item => item.id === normalizedProduct.id);
  const isInComparison = isInCompare(normalizedProduct.id);

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(normalizedProduct.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(normalizedProduct);
      toast.success('Added to wishlist!');
    }
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCompare(normalizedProduct);
    toast.success('Added to comparison!');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(normalizedProduct, 1);
    toast.success('Added to cart!');
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/product/${normalizedProduct.slug}`}>
        <div className="relative overflow-hidden rounded-lg bg-card border border-border hover:shadow-lg transition-shadow duration-300">
          {/* Badges */}
          {normalizedProduct.badges && normalizedProduct.badges.length > 0 && (
            <div className="absolute top-2 left-2 z-10 flex gap-1">
              {normalizedProduct.badges.map((badge) => (
                <Badge key={badge} variant={badge === 'sale' ? 'destructive' : 'default'}>
                  {badge.toUpperCase()}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur"
              onClick={handleAddToWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur"
              onClick={handleAddToCompare}
              disabled={isInComparison}
            >
              <GitCompare className={`h-4 w-4 ${isInComparison ? 'fill-primary text-primary' : ''}`} />
            </Button>
          </div>

          {/* Image */}
          <div className="aspect-[4/3] bg-muted relative overflow-hidden">
            <img
              src={normalizedProduct.images[0]}
              alt={normalizedProduct.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Quick Add Button */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(normalizedProduct.rating)
                      ? 'fill-accent text-accent'
                      : 'fill-muted text-muted'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({normalizedProduct.reviewCount})
              </span>
            </div>

            <h3 className="font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">
              {normalizedProduct.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-bold">{formatPrice(normalizedProduct.price)}</span>
              {normalizedProduct.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(normalizedProduct.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs ${normalizedProduct.inStock ? 'text-green-600' : 'text-destructive'}`}>
                {normalizedProduct.inStock ? (normalizedProduct.lowStock ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
              </span>
              <span className="text-xs text-muted-foreground">{normalizedProduct.brand}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
