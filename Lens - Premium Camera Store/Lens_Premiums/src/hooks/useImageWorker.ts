import { useEffect, useRef } from 'react';

type WorkerOperations = 'resize' | 'average-color' | 'similarity' | 'error';

interface WorkerError {
  type: 'error';
  error: string;
}

interface ImageWorkerMessage {
  type: WorkerOperations;
  data?: any;
  error?: string;
}

interface UseImageWorkerOptions {
  onMessage?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useImageWorker({ onMessage, onError }: UseImageWorkerOptions = {}) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL('../workers/imageWorker.ts', import.meta.url),
      { type: 'module' }
    );

    // Set up message handler
    const handleMessage = (e: MessageEvent<ImageWorkerMessage>) => {
      if (e.data.type === 'error') {
        onError?.(e.data.error);
      } else {
        onMessage?.(e.data);
      }
    };

    workerRef.current.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      workerRef.current?.removeEventListener('message', handleMessage);
      workerRef.current?.terminate();
    };
  }, [onMessage, onError]);

  const processImage = (operation: WorkerOperations, data: any) => {
    if (!workerRef.current) {
      throw new Error('Worker not initialized');
    }
    workerRef.current.postMessage({ type: operation, data });
  };

  return {
    processImage,
    resizeImages: (images: { imageUrl: string; width?: number; height?: number }[]) =>
      processImage('resize', images),
    getAverageColors: (images: { imageUrl: string }[]) =>
      processImage('average-color', images),
    calculateSimilarity: (source: string, targets: string[]) =>
      processImage('similarity', { source, targets }),
  };
}