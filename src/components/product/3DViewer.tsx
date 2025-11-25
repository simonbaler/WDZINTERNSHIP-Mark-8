import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html, useProgress, useGLTF } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Box, Maximize2, RotateCw, Eye, Info, Play, Pause, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import Rotating3DCamera from './Rotating3DCamera';

interface Hotspot {
  position: [number, number, number];
  label: string;
  description: string;
}

interface ViewerProps {
  modelUrl?: string;
  fallback360Images?: string[];
  productName: string;
  hotspots?: Hotspot[];
  isAdmin?: boolean;
}

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

// 3D Model Component
function Model({ url, onLoad }: { url: string; onLoad?: () => void }) {
  const gltf = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (gltf && onLoad) {
      onLoad();
    }
  }, [gltf, onLoad]);

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Center and scale model
  useEffect(() => {
    if (gltf && meshRef.current) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;
      
      gltf.scene.scale.setScalar(scale);
      gltf.scene.position.sub(center.multiplyScalar(scale));
    }
  }, [gltf]);

  return <primitive ref={meshRef} object={gltf.scene} />;
}

// Hotspot Marker Component
function HotspotMarker({ position, label, description, onClick }: Hotspot & { onClick: () => void }) {
  return (
    <Html position={position} distanceFactor={8}>
      <button
        onClick={onClick}
        className="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
      >
        <Info className="h-4 w-4 text-primary-foreground" />
      </button>
    </Html>
  );
}

// 360 Viewer Fallback
function Viewer360({ images, productName }: { images: string[]; productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 20) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentIndex((prev) => (prev + direction + images.length) % images.length);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full h-full bg-gradient-to-b from-muted/50 to-background flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={images[currentIndex]}
        alt={`${productName} 360° view ${currentIndex + 1}`}
        className="max-w-full max-h-full object-contain select-none pointer-events-none"
        draggable={false}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        <RotateCw className="inline-block h-3 w-3 mr-1" />
        Drag to rotate
      </div>
    </div>
  );
}

export function ThreeDViewer({ 
  modelUrl, 
  fallback360Images, 
  productName,
  hotspots = [],
  isAdmin = false 
}: ViewerProps) {
  const [viewMode, setViewMode] = useState<'3d' | '360'>('3d');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<any>(null);

  // Auto-switch to 360 if no 3D model
  useEffect(() => {
    if (!modelUrl && fallback360Images) {
      setViewMode('360');
    }
  }, [modelUrl, fallback360Images]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 10 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 10) % 360);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    if (canvasRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        canvasRef.current.requestFullscreen();
      }
    }
  };

  // AR Quick Look (iOS Safari only)
  const handleARView = () => {
    if (modelUrl && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // iOS AR Quick Look
      const link = document.createElement('a');
      link.rel = 'ar';
      link.href = modelUrl.replace('.glb', '.usdz'); // Assumes USDZ version exists
      link.click();
    } else {
      alert('AR viewing is currently only supported on iOS devices');
    }
  };

  const has3DModel = !!modelUrl;
  const has360Images = !!fallback360Images && fallback360Images.length > 0;

  return (
    <div className="relative w-full aspect-square max-h-[600px] rounded-lg overflow-hidden bg-gradient-to-b from-muted/30 to-background" ref={canvasRef}>
      {/* Control Panel - Top Right */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-background/90 backdrop-blur-sm border rounded-lg p-2 shadow-lg"
          >
            {/* Rotation Controls */}
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRotateLeft}
                className="h-8 w-8"
                title="Rotate left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRotateRight}
                className="h-8 w-8"
                title="Rotate right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Zoom Control */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleZoomToggle}
              className="h-8 w-8"
              title={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </Button>

            {/* Play/Pause */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePlayPause}
              className="h-8 w-8"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <div className="w-full h-px bg-border" />

            {/* Fullscreen */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleFullscreen}
              className="h-8 w-8"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>

            {/* Hotspots Toggle */}
            {hotspots.length > 0 && (
              <Button
                size="icon"
                variant={showHotspots ? "default" : "ghost"}
                onClick={() => setShowHotspots(!showHotspots)}
                className="h-8 w-8"
                title="Toggle hotspots"
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Viewer */}
      {viewMode === '3d' && has3DModel ? (
        <Rotating3DCamera 
          cameraType={
            productName.toLowerCase().includes('canon') ? 'canon' :
            productName.toLowerCase().includes('sony') ? 'sony' :
            productName.toLowerCase().includes('nikon') ? 'nikon' :
            productName.toLowerCase().includes('fuji') ? 'fuji' :
            productName.toLowerCase().includes('panasonic') ? 'panasonic' :
            'canon'
          }
          rotation={rotation}
          isZoomed={isZoomed}
          isPlaying={isPlaying}
        />
      ) : modelUrl && (modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf')) ? (
        <Canvas shadows dpr={[1, 2]} className="bg-gradient-to-b from-muted/30 to-background">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          
          <Suspense fallback={<Loader />}>
            <Model url={modelUrl} onLoad={() => setModelLoaded(true)} />
            
            {/* Hotspots */}
            {modelLoaded && showHotspots && hotspots.map((hotspot, idx) => (
              <HotspotMarker
                key={idx}
                {...hotspot}
                onClick={() => setSelectedHotspot(hotspot)}
              />
            ))}
            
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            {/* Environment */}
            <Environment preset="studio" />
          </Suspense>
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      ) : viewMode === '360' && has360Images ? (
        <Viewer360 images={fallback360Images} productName={productName} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No 3D model or 360° images available</p>
          </div>
        </div>
      )}

      {/* Hotspot Info Panel */}
      {selectedHotspot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 bg-card border rounded-lg p-4 shadow-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold">{selectedHotspot.label}</h4>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSelectedHotspot(null)}
              className="h-6 w-6"
            >
              ×
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{selectedHotspot.description}</p>
        </motion.div>
      )}

      {/* Admin Model Inspector */}
      {isAdmin && viewMode === '3d' && modelLoaded && (
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3 text-xs">
          <p className="font-semibold mb-1">Model Inspector</p>
          <p className="text-muted-foreground">Model loaded successfully</p>
        </div>
      )}

      {/* Instructions */}
      {viewMode === '3d' && has3DModel && !isPlaying && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm pointer-events-none flex items-center gap-2"
        >
          <RotateCw className="h-3 w-3" />
          Use controls to rotate, zoom, and play 360° view
        </motion.div>
      )}

      {/* Playing Indicator */}
      {isPlaying && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm pointer-events-none flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
          360° Auto-Rotation Active
        </motion.div>
      )}
    </div>
  );
}
