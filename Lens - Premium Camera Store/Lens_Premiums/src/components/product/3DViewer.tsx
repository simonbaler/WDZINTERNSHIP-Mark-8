import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Html } from '@react-three/drei';

interface ViewerProps {
  lowPolyUrl?: string;
  highPolyUrl?: string;
  fallbackImages?: string[];
  className?: string;
}

function Model({ url }: { url: string }) {
  // useGLTF caches models automatically
  const gltf = useGLTF(url, true) as any;
  return <primitive object={gltf.scene} dispose={null} />;
}

export const ViewerFallback: React.FC<{ images?: string[] }> = ({ images }) => {
  // simple fallback - show first image
  if (!images || images.length === 0) return null;
  return (
    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
      <img src={images[0]} alt="product fallback" className="w-full h-full object-cover" />
    </div>
  );
};

export const ThreeDViewer: React.FC<ViewerProps> = ({ lowPolyUrl, highPolyUrl, fallbackImages, className }) => {
  const hasModel = !!(lowPolyUrl || highPolyUrl);
  const highLoadedRef = useRef(false);

  useEffect(() => {
    // prefetch high poly in background if provided
    if (highPolyUrl) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = highPolyUrl;
      link.as = 'fetch';
      document.head.appendChild(link);
      return () => { document.head.removeChild(link); };
    }
  }, [highPolyUrl]);

  if (!hasModel) {
    return <ViewerFallback images={fallbackImages} />;
  }

  // Render low poly first, then load high poly via Suspense boundary
  return (
    <div className={className ?? ''}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Suspense fallback={<Html center>Loading 3D...</Html>}>
          <Stage environment="studio" intensity={0.7} adjustCamera>
            {lowPolyUrl && <Model url={lowPolyUrl} />}
            {/* highPoly will replace low poly if provided */}
            {highPolyUrl && <Model url={highPolyUrl} />}
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ThreeDViewer;
