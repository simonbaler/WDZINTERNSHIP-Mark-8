import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Star, ShoppingCart, Truck, Shield, RotateCcw, View } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useCartStore } from '@/store/cartStore';
import { mockProducts } from '@/lib/mockData';
import { toast } from 'sonner';
import { ImageGallery } from '@/components/product/ImageGallery';
import ThreeDViewer from '@/components/product/3DViewer';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ProductTabs } from '@/components/product/ProductTabs';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ProductARView } from '@/components/product/ProductARView';
import { ARQuickLook } from '@/components/product/ARQuickLook';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  const product = mockProducts.find(p => p.slug === id || p.id === id);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].id);
    }
  }, [product]);

  const currentVariant = product?.variants?.find(v => v.id === selectedVariant);
  const currentPrice = currentVariant?.price || product?.price || 0;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/cameras')}>Back to Cameras</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    
    if (currentVariant && currentVariant.inventory === 0) {
      toast.error('This variant is out of stock');
      return;
    }
    
    addToCart(product, quantity);

    // Fly animation from product image to cart button (DOM-based)
    try {
      const img = document.getElementById('product-main-image') as HTMLImageElement | null;
      const cartBtn = document.getElementById('cart-button');
      if (img && cartBtn) {
        const imgRect = img.getBoundingClientRect();
        const cartRect = cartBtn.getBoundingClientRect();

        const fly = img.cloneNode(true) as HTMLImageElement;
        fly.style.position = 'fixed';
        fly.style.left = `${imgRect.left}px`;
        fly.style.top = `${imgRect.top}px`;
        fly.style.width = `${imgRect.width}px`;
        fly.style.height = `${imgRect.height}px`;
        fly.style.transition = 'transform 0.8s cubic-bezier(.2,.8,.2,1), opacity 0.6s';
        fly.style.zIndex = '9999';
        fly.style.borderRadius = '8px';
        document.body.appendChild(fly);

        const dx = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
        const dy = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);
        const scale = 0.12;

        requestAnimationFrame(() => {
          fly.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(10deg)`;
          fly.style.opacity = '0.6';
        });

        setTimeout(() => fly.remove(), 900);
      }
    } catch (err) {
      // ignore animation issues
    }

    toast.success('Added to cart!', {
      description: `${product.name} × ${quantity}`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (currentVariant && currentVariant.inventory === 0) {
      toast.error('This variant is out of stock');
      return;
    }
    
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cameras">Cameras</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/cameras?brand=${product.brand}`}>{product.brand}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery and AR */}
          <div className="space-y-4">
            <ImageGallery images={product.images} productName={product.name} />
            {product.models && (
              <ARQuickLook
                modelUrl={product.models.usdz}
                glbUrl={product.models.glb}
                fallbackImage={product.images[0]}
              />
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">SKU: {product.id}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">₹{currentPrice.toLocaleString()}</span>
              {product.originalPrice && currentPrice < product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm text-primary">Save {Math.round((1 - currentPrice / product.originalPrice) * 100)}%</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <div className="h-2 w-2 rounded-full bg-green-600" />
                <span>In Stock</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-muted-foreground">Delivery by Dec 28</span>
            </div>

            <Separator />

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <>
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
                <Separator />
              </>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" aria-label="Add to wishlist">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share product">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                <Truck className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                <Shield className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">2 Year Warranty</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                <RotateCcw className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">30-Day Returns</p>
              </div>
            </div>

            {/* Accordion Details */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="highlights">
                <AccordionTrigger>Highlights</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 45.7MP Full-Frame Sensor</li>
                    <li>• 8K Video Recording</li>
                    <li>• Advanced AI Autofocus</li>
                    <li>• In-Body Image Stabilization</li>
                    <li>• Weather-Sealed Body</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="specs">
                <AccordionTrigger>Specifications</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sensor</span>
                      <span>Full Frame CMOS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolution</span>
                      <span>45.7 Megapixels</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ISO Range</span>
                      <span>100-51200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Video</span>
                      <span>8K at 30fps</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="box">
                <AccordionTrigger>What's in the Box</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Camera Body</li>
                    <li>• Battery Pack</li>
                    <li>• Battery Charger</li>
                    <li>• USB Cable</li>
                    <li>• Strap</li>
                    <li>• User Manual</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <ProductTabs
            description={product.description}
            specs={product.specs || {}}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>

        {/* Related Products */}
        <RelatedProducts products={mockProducts} currentProductId={product.id} />
      </div>
    </div>
  );
}
