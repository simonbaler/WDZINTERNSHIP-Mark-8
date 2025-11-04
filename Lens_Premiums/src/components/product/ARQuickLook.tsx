import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { View, Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useModelWorker } from '@/hooks/useModelWorker';

interface ARQuickLookProps {
  modelUrl: string;     // URL to the USDZ model for iOS
  glbUrl: string;       // URL to the GLB model for other platforms
  fallbackImage: string; // Fallback image URL if AR is not supported
}

export function ARQuickLook({ modelUrl, glbUrl, fallbackImage }: ARQuickLookProps) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isModelViewerSupported, setIsModelViewerSupported] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);
  
  const { loadModel } = useModelWorker({
    onProgress: (loaded, total) => {
      setLoadingProgress((loaded / total) * 100);
    },
    onComplete: (data) => {
      setModelData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error loading model:', error);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    // Load the 3D model when the URL changes
    if (glbUrl) {
      setIsLoading(true);
      loadModel({ url: glbUrl, type: 'glb', optimize: true });
    }

    // Check if the device supports AR Quick Look
    const isIOS = /iPhone|iPad|iPod/.test(navigator.platform);
    setIsARSupported(isIOS);

    // Check if model-viewer is supported
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.type = 'module';
    document.head.appendChild(script);

    script.onload = () => {
      setIsModelViewerSupported(true);
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (!isARSupported && !isModelViewerSupported) {
    // Fallback to regular image if neither AR nor model-viewer is supported
    return (
      <img 
        src={fallbackImage} 
        alt="Product" 
        className="w-full h-full object-cover"
      />
    );
  }

  if (isARSupported) {
    // iOS AR Quick Look
    return (
      <div className="relative">
        <img 
          src={fallbackImage} 
          alt="Product" 
          className="w-full h-full object-cover"
        />
        <a
          rel="ar"
          href={modelUrl}
          className="absolute bottom-4 right-4"
        >
          <Button>
            <View className="mr-2 h-4 w-4" />
            View in AR
          </Button>
        </a>
      </div>
    );
  }

  // For other platforms, use model-viewer
  return (
    <div className="relative w-full h-full min-h-[400px]">
      <model-viewer
        ref={modelViewerRef as any}
        src={glbUrl}
        poster={fallbackImage}
        alt="3D model"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        environment-image="neutral"
        shadow-intensity="1"
        exposure="1"
        style={{ width: '100%', height: '100%' }}
      >
        <Button
          slot="ar-button"
          className="absolute bottom-4 right-4"
        >
          <View className="mr-2 h-4 w-4" />
          View in AR
        </Button>
      </model-viewer>
    </div>
  );
}