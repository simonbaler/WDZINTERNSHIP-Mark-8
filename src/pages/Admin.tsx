import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageGeneratorBanner } from '@/components/admin/ImageGeneratorBanner';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  BarChart3,
  FolderTree,
  Activity,
  Tag,
  ImageIcon,
  Video
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const CameraModel = () => {
    const { scene } = useGLTF('/models/camera-generic.glb');
    return <primitive object={scene} scale={1.1} />;
  };

  const adminSections = [
    {
      title: 'Feature Flags',
      description: 'Toggle futuristic 2030+ features',
      icon: Settings,
      href: '/admin/feature-flags',
      color: 'text-purple-500',
    },
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: Package,
      href: '/admin/products',
      color: 'text-blue-500',
    },
    {
      title: 'Media Library',
      description: 'Manage images and 3D models',
      icon: Package,
      href: '/admin/media',
      color: 'text-cyan-500',
    },
    {
      title: 'Embeddings',
      description: 'Generate AI search embeddings',
      icon: Package,
      href: '/admin/embeddings',
      color: 'text-indigo-500',
    },
    {
      title: 'Webhooks & n8n',
      description: 'Manage webhooks and automation',
      icon: Settings,
      href: '/admin/webhooks',
      color: 'text-violet-500',
    },
    {
      title: 'CSV Import',
      description: 'Bulk import products',
      icon: Package,
      href: '/admin/csv-import',
      color: 'text-teal-500',
    },
    {
      title: 'Monitoring',
      description: 'System health and observability',
      icon: Activity,
      href: '/admin/monitoring',
      color: 'text-red-500',
    },
    {
      title: 'Merchandising',
      description: 'Pin products to categories',
      icon: Tag,
      href: '/admin/merchandising',
      color: 'text-amber-500',
    },
    {
      title: 'AI Image Generator',
      description: 'Generate 3D product images with AI',
      icon: ImageIcon,
      href: '/admin/image-generator',
      color: 'text-fuchsia-500',
    },
    {
      title: 'Welcome Video',
      description: 'Manage intro video for welcome page',
      icon: Video,
      href: '/admin/welcome-video',
      color: 'text-teal-600',
    },
    {
      title: 'AI Copywriter',
      description: 'Generate product descriptions with AI',
      icon: ImageIcon,
      href: '/admin/ai-copywriter',
      color: 'text-emerald-500',
    },
    {
      title: 'AI Pricing Assistant',
      description: 'Suggest fair retail price with AI',
      icon: ImageIcon,
      href: '/admin/ai-pricing',
      color: 'text-rose-500',
    },
    {
      title: 'AI Store Insights',
      description: 'Analyze catalog and get insights',
      icon: ImageIcon,
      href: '/admin/ai-insights',
      color: 'text-sky-500',
    },
    {
      title: 'Orders',
      description: 'View and manage orders',
      icon: ShoppingBag,
      href: '/admin/orders',
      color: 'text-green-500',
    },
    {
      title: 'Categories',
      description: 'Organize product categories',
      icon: FolderTree,
      href: '/admin/categories',
      color: 'text-purple-500',
    },
    {
      title: 'Customers',
      description: 'Manage customer accounts',
      icon: Users,
      href: '/admin/customers',
      color: 'text-orange-500',
    },
    {
      title: 'Analytics',
      description: 'View sales and statistics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'text-pink-500',
    },
    {
      title: 'Settings',
      description: 'Configure store settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your ecommerce store
          </p>
        </div>

        {/* 3D Hero Banner */}
        <div className="mb-8 rounded-xl overflow-hidden border bg-card">
          <div className="h-[260px]">
            <Canvas camera={{ position: [2.4, 1.4, 2.4], fov: 52 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[4, 4, 4]} intensity={0.9} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
              <Environment preset="studio" />
              <CameraModel />
            </Canvas>
          </div>
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Modern 3D panel — powered by WebGL</p>
            <a href="/" className="text-sm font-semibold text-accent">Go to User Panel</a>
          </div>
        </div>

        {/* AI Image Generator Banner */}
        <div className="mb-6">
          <ImageGeneratorBanner />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Link key={section.href} to={section.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-3xl font-bold text-green-500">0</p>
                <p className="text-sm text-muted-foreground">Orders</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-3xl font-bold text-orange-500">0</p>
                <p className="text-sm text-muted-foreground">Customers</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-3xl font-bold text-purple-500">₹0</p>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Admin access is controlled by the user_roles table.
            To make a user an admin, add a row with role='admin' for their user_id.
          </p>
        </div>
      </div>
    </div>
  );
}
