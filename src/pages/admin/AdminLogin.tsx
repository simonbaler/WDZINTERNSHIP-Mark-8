import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldCheck } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';

function CameraModel() {
  const { scene } = useGLTF('/models/camera-generic.glb');
  return <primitive object={scene} scale={1.2} />;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Fixed admin credentials
    const ADMIN_USER = 'lens@2821';
    const ADMIN_PASS = 'Chinnu@2821';

    try {
      if (email === ADMIN_USER && password === ADMIN_PASS) {
        localStorage.setItem('ADMIN_OVERRIDE', 'true');
        toast.success('Admin login successful');
        navigate('/admin');
      } else {
        toast.error('Invalid admin credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/20 flex items-center justify-center px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-2xl overflow-hidden"
        >
          <div className="h-[380px]">
            <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
              <Environment preset="studio" />
              <CameraModel />
            </Canvas>
          </div>
          <div className="p-6 border-t">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <div>
                <h2 className="text-lg font-semibold">LENS Admin Access</h2>
                <p className="text-sm text-muted-foreground">Secure entry for administrative tasks</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Admin Login</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="text"
                  placeholder="lens@2821"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Chinnu@2821"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in as Admin'}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link to="/">Go to User Panel</Link>
              </Button>
              <p className="text-xs text-muted-foreground">For regular users, use the Account login.</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

useGLTF.preload('/models/camera-generic.glb');