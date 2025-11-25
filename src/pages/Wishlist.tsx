import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';

export default function Wishlist() {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love for later</p>
          <Button onClick={() => navigate('/cameras')}>Shop Cameras</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-lg border overflow-hidden group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={() => {
                    removeFromWishlist(product.id);
                    toast.success('Removed from wishlist');
                  }}
                >
                  <Heart className="h-5 w-5 fill-primary text-primary" />
                </Button>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
