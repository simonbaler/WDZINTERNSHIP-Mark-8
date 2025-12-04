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
import { SocialShare } from '@/components/product/SocialShare';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToCompare, isInCompare } = useCompareStore();
  const { getProductImages } = useProductImages();
  const [displayImages, setDisplayImages] = useState(product.images);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const enhanced = getProductImages(product.slug, product.images);
    setDisplayImages(enhanced);
  }, [product.slug, product.images, getProductImages]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success('Added to cart');
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isInCompare(product.id)) {
      addToCompare(product);
      toast.success('Added to comparison');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currentImage = displayImages?.[0] ?? product.images?.[0];

  return (
    <motion.div whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.25 }}>
      <Link to={`/product/${product.slug}`} className="group block bg-card rounded-lg border overflow-hidden">
        <div className="relative aspect-[4/3] bg-muted">
          {currentImage && (
            <OptimizedImage src={currentImage} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          )}

          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-2 left-2 z-10 flex gap-1">
              {product.badges.map((badge) => (
                <Badge key={badge} variant={badge === 'sale' ? 'destructive' : 'default'} className="text-[10px] px-2 py-0.5">
                  {badge.toUpperCase()}
                </Badge>
              ))}
            </div>
          )}

          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur" onClick={handleToggleWishlist}>
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur" onClick={handleAddToCompare} disabled={isInCompare(product.id)}>
              <GitCompare className={`h-4 w-4 ${isInCompare(product.id) ? 'fill-primary text-primary' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'fill-muted text-muted'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
          </div>

          <h3 className="font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
          </div>

          <div className="flex items-center gap-2">
            <motion.div animate={added ? { scale: 1.03 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="flex-1">
              <Button className={`w-full ${added ? 'bg-accent text-accent-foreground' : ''}`} onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {added ? 'Added' : 'Add to Cart'}
              </Button>
            </motion.div>
          </div>

          <div className="mt-2">
            <SocialShare productName={product.name} productSlug={product.slug} productPrice={product.price} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
