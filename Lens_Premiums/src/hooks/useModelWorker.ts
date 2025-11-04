import { useEffect, useRef, useCallback } from 'react';

interface LoadModelOptions {
  url: string;
  type: 'glb' | 'gltf' | 'obj';
  optimize?: boolean;
}

interface UseModelWorkerOptions {
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: (data: ArrayBuffer) => void;
  onError?: (error: string) => void;
}

export function useModelWorker(options: UseModelWorkerOptions = {}) {
  const workerRef = useRef<Worker | null>(null);
  const { onProgress, onComplete, onError } = options;

  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL('../workers/modelWorker.ts', import.meta.url),
      { type: 'module' }
    );

    // Set up message handler
    const handleMessage = (e: MessageEvent) => {
      switch (e.data.type) {
        case 'progress':
          onProgress?.(e.data.loaded, e.data.total);
          break;
        case 'complete':
          onComplete?.(e.data.data);
          break;
        case 'error':
          onError?.(e.data.message);
          break;
      }
    };

    workerRef.current.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      workerRef.current?.removeEventListener('message', handleMessage);
      workerRef.current?.terminate();
    };
  }, [onProgress, onComplete, onError]);

  const loadModel = useCallback((options: LoadModelOptions) => {
    if (!workerRef.current) {
      throw new Error('Worker not initialized');
    }
    workerRef.current.postMessage(options);
  }, []);

  return { loadModel };
}