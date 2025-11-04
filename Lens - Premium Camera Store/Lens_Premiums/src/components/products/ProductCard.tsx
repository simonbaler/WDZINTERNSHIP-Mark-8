import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative overflow-hidden rounded-lg bg-card border border-border hover:shadow-lg transition-shadow duration-300">
          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-2 left-2 z-10 flex gap-1">
              {product.badges.map((badge) => (
                <Badge key={badge} variant={badge === 'sale' ? 'destructive' : 'default'}>
                  {badge.toUpperCase()}
                </Badge>
              ))}
            </div>
          )}

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to wishlist
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* Image */}
          <div className="aspect-[4/3] bg-muted relative overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
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
                    i < Math.floor(product.rating)
                      ? 'fill-accent text-accent'
                      : 'fill-muted text-muted'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({product.reviewCount})
              </span>
            </div>

            <h3 className="font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-destructive'}`}>
                {product.inStock ? (product.lowStock ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
              </span>
              <span className="text-xs text-muted-foreground">{product.brand}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
