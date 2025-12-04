import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductsStore } from '@/store/productsStore';
import { ArrowRight, Camera, Package, Shield, Truck, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useSiteSettingsStore } from '@/store/siteSettingsStore';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageCarousel } from '@/components/carousel/ImageCarousel';
import { useHeroSlidesStore } from '@/store/heroSlidesStore';
import { useIsMobile } from '@/hooks/use-mobile';

const categories = [
  { name: 'Cameras', icon: Camera, href: '/cameras' },
  { name: 'Lenses', icon: Camera, href: '/lenses' },
  { name: 'Bundles', icon: Package, href: '/bundles' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over ₹4,999' },
  { icon: Shield, title: '30-Day Returns', description: 'Hassle-free returns' },
  { icon: Package, title: 'Secure Packaging', description: 'Safe delivery guaranteed' },
  { icon: Camera, title: 'Expert Support', description: '24/7 photography advice' },
];

export default function Home() {
  const navigate = useNavigate();
  const welcomeVideoUrl = useSiteSettingsStore((s) => s.welcomeVideoUrl);
  const products = useProductsStore((s) => s.products);
  const slides = useHeroSlidesStore((s) => s.slides);
  const isMobile = useIsMobile();
  const featuredProducts = products.slice(0, 8);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const cta = hour >= 18 ? 'Explore Night Shoots' : 'Find Daylight Gear';
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeBasedContent = useMemo(() => ({
    greeting,
    headline: 'Capture Every Moment',
    subheading: 'Premium cameras, lenses and accessories with fast shipping',
    cta,
  }), [greeting, cta]);
  const isLoading = false;
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { innerWidth, innerHeight } = window;
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    setParallax({ x: -nx * 20, y: -ny * 12 });
  };

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('INTRO_SHOWN') === 'true';
    if (!alreadyShown && welcomeVideoUrl) {
      navigate('/welcome');
    }
  }, [navigate, welcomeVideoUrl]);

  return (
    <div>
      <section onMouseMove={handleMouseMove} onMouseLeave={() => setParallax({ x: 0, y: 0 })} className="relative min-h-[700px] flex items-center bg-gradient-to-br from-background via-muted/40 to-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent pointer-events-none" />
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/15 blur-3xl"
          animate={{ x: [0, 40, -20, 0], y: [0, -10, 20, 0], scale: [1, 0.95, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 24, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, -30, 30, 0], y: [0, 30, -15, 0], scale: [1, 1.05, 0.95, 1] }}
          transition={{ repeat: Infinity, duration: 26, ease: 'easeInOut' }}
        />

        <div className="max-w-[1400px] mx-auto px-6 py-24 w-full relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="space-y-8">
              <motion.div animate={{ x: isMobile ? 0 : parallax.x, y: isMobile ? 0 : parallax.y }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} className="space-y-8">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 text-accent rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
                  {timeBasedContent.greeting} • Premium Equipment
                </span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs text-white">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Trending Now
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
                <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight">
                  {timeBasedContent.headline}
                </h1>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="inline-block bg-gradient-to-r from-accent via-accent/80 to-primary bg-[length:200%_auto] bg-clip-text text-transparent" />
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                {timeBasedContent.subheading}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex flex-wrap gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" asChild className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                    <Link to="/cameras">
                      <Camera className="h-5 w-5" />
                      {timeBasedContent.cta}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline" asChild className="gap-2">
                    <Link to="/search">
                      <Search className="h-5 w-5" />
                      Browse All
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="grid grid-cols-3 gap-4 pt-8 border-t border-border/40">
                <div className="space-y-1">
                  <motion.div whileHover={{ scale: 1.1 }} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-600">
                    <Shield className="h-5 w-5" />
                  </motion.div>
                  <p className="text-xs font-medium">Authentic</p>
                  <p className="text-xs text-muted-foreground">100% Verified</p>
                </div>
                <div className="space-y-1">
                  <motion.div whileHover={{ scale: 1.1 }} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-600">
                    <Truck className="h-5 w-5" />
                  </motion.div>
                  <p className="text-xs font-medium">Fast Shipping</p>
                  <p className="text-xs text-muted-foreground">24-48 Hours</p>
                </div>
                <div className="space-y-1">
                  <motion.div whileHover={{ scale: 1.1 }} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-600">
                    <Package className="h-5 w-5" />
                  </motion.div>
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30 Days Free</p>
                </div>
              </motion.div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} className="relative h-full min-h-[600px]">
              <ImageCarousel slides={slides} autoplayInterval={6000} onSlideChange={setCurrentSlide} />
              <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(#n)\"/></svg>')", backgroundSize: '140px 140px' }} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="text-center">
                <feature.icon className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground">Find the perfect gear for your photography journey</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div key={category.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to={category.href}>
                <div className="relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl transition-shadow duration-300 group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                    <category.icon className="h-24 w-24 text-accent/40 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-2 group-active:text-accent group-hover:text-accent transition-colors">
                      Explore Collection
                      <ArrowRight className="h-4 w-4" />
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-20 bg-muted/30">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Editor's Picks</h2>
          <p className="text-lg text-muted-foreground">Handpicked products recommended by our photography experts</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))
          ) : (
            featuredProducts.slice(0, 4).map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link to="/cameras">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-12 md:p-20 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">Ready to Start Your Journey?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">Join thousands of photographers who trust us for their gear. Get exclusive deals and expert advice.</p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/cameras">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
