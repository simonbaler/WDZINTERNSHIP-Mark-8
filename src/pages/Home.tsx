// Import necessary components and hooks
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductsStore } from '@/store/productsStore';
import { ArrowRight, Camera, Package, Shield, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSiteSettingsStore } from '@/store/siteSettingsStore';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// Define the main categories for the home page
const categories = [
  { name: 'Cameras', icon: Camera, href: '/cameras', image: '/placeholder.svg' },
  { name: 'Lenses', icon: Camera, href: '/lenses', image: '/placeholder.svg' },
  { name: 'Bundles', icon: Package, href: '/bundles', image: '/placeholder.svg' },
];

// Define the key features to be displayed on the home page
const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over ₹4,999' },
  { icon: Shield, title: '30-Day Returns', description: 'Hassle-free returns' },
  { icon: Package, title: 'Secure Packaging', description: 'Safe delivery guaranteed' },
  { icon: Camera, title: 'Expert Support', description: '24/7 photography advice' },
];

// The Home component for the main landing page
export default function Home() {
  const navigate = useNavigate();
  const welcomeVideoUrl = useSiteSettingsStore((s) => s.welcomeVideoUrl);

  // Redirect to the welcome page if the welcome video hasn't been shown
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('INTRO_SHOWN') === 'true';
    if (!alreadyShown && welcomeVideoUrl) {
      navigate('/welcome');
    }
  }, [navigate, welcomeVideoUrl]);
  
  // Get the first 8 products to be featured on the home page
  const featuredProducts = useProductsStore((s) => s.products).slice(0, 8);
  const isLoading = false; // Placeholder for loading state

  return (
    <div>
      {/* Hero Section: The main banner for the home page */}
      <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Capture Every
                <br />
                <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                  Moment
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Premium cameras and lenses for photographers who demand excellence.
                Professional gear at competitive prices.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/cameras">
                    Shop Cameras
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/bundles">Explore Bundles</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Camera className="h-32 w-32 mx-auto mb-4 text-accent/40" />
                  <p className="text-sm text-muted-foreground">3D Viewer Coming Soon</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar: A section to highlight key features of the store */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <feature.icon className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories: A section to display product categories */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground">
            Find the perfect gear for your photography journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Link to={category.href}>
                <div className="relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl transition-shadow duration-300 group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                    <category.icon className="h-24 w-24 text-accent/40 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-2 group-hover:text-accent transition-colors">
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

      {/* Featured Products: A section to showcase a selection of products */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Editor's Picks</h2>
          <p className="text-lg text-muted-foreground">
            Handpicked products recommended by our photography experts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Show skeleton loaders while products are loading
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))
          ) : (
            // Render the featured products
            featuredProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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

      {/* Call to Action (CTA) Section: A section to encourage users to shop */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-12 md:p-20 text-center"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of photographers who trust us for their gear. Get exclusive
              deals and expert advice.
            </p>
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
