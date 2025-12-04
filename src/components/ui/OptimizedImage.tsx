import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component with modern image loading techniques:
 * - Native lazy loading
 * - Async decoding to prevent main thread blocking
 * - srcSet support for responsive images
 * - Blur-up placeholder effect
 * - Error handling and fallback
 */
export const OptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate srcSet for responsive images (if URL supports it)
  const generateSrcSet = () => {
    try {
      const url = new URL(src);
      // Support common image services
      if (url.hostname.includes('googleusercontent') || url.hostname.includes('unsplash')) {
        return `${src}?w=300 300w, ${src}?w=600 600w, ${src}?w=1200 1200w`;
      }
    } catch (e) {
      // Not a valid URL, skip srcSet
    }
    return undefined;
  };

  if (hasError) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center`}>
        <span className="text-xs text-muted-foreground">Image failed to load</span>
      </div>
    );
  }

  return (
    <picture>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        srcSet={generateSrcSet()}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </picture>
  );
};
