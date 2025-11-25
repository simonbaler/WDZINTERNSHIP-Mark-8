import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductImageMap {
  [productId: string]: {
    [angle: string]: string;
  };
}

let cachedImages: ProductImageMap | null = null;
let cachePromise: Promise<ProductImageMap> | null = null;

async function fetchGeneratedImages(): Promise<ProductImageMap> {
  if (cachedImages) {
    return cachedImages;
  }

  if (cachePromise) {
    return cachePromise;
  }

  cachePromise = (async () => {
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .list('generated', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching generated images:', error);
        return {};
      }

      const imageMap: ProductImageMap = {};

      // Parse filenames to map images to products
      // Format: brand-product-name-angle-timestamp.png
      data?.forEach(file => {
        const match = file.name.match(/^(.+?)-(front|back|side|top)-\d+\.png$/);
        if (match) {
          const productKey = match[1]; // e.g., "canon-eos-r5"
          const angle = match[2];
          
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(`generated/${file.name}`);

          if (!imageMap[productKey]) {
            imageMap[productKey] = {};
          }
          imageMap[productKey][angle] = publicUrl;
        }
      });

      cachedImages = imageMap;
      return imageMap;
    } catch (error) {
      console.error('Error processing images:', error);
      return {};
    } finally {
      cachePromise = null;
    }
  })();

  return cachePromise;
}

export function useProductImages() {
  const [imageMap, setImageMap] = useState<ProductImageMap>(cachedImages || {});
  const [isLoading, setIsLoading] = useState(!cachedImages);

  useEffect(() => {
    if (cachedImages) {
      return;
    }

    fetchGeneratedImages().then(map => {
      setImageMap(map);
      setIsLoading(false);
    });
  }, []);

  const getProductImages = (productSlug: string, fallbackImages: string[]): string[] => {
    const productKey = productSlug;
    const generated = imageMap[productKey];

    if (!generated || Object.keys(generated).length === 0) {
      return fallbackImages;
    }

    const angles = ['front', 'back', 'side', 'top'];
    const images = angles
      .map(angle => generated[angle])
      .filter(Boolean);

    return images.length > 0 ? images : fallbackImages;
  };

  return { imageMap, getProductImages, isLoading };
}

// Helper to get images synchronously (for mockData enhancement)
export function enhanceProductWithImages(product: any, imageMap: ProductImageMap) {
  const productKey = product.slug;
  const generated = imageMap[productKey];

  if (!generated || Object.keys(generated).length === 0) {
    return product;
  }

  const angles = ['front', 'back', 'side', 'top'];
  const images = angles
    .map(angle => generated[angle])
    .filter(Boolean);

  return {
    ...product,
    images: images.length > 0 ? images : product.images,
    hasGeneratedImages: images.length > 0
  };
}
