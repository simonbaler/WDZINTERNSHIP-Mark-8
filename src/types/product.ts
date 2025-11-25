export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

export interface ProductHotspot {
  position: [number, number, number];
  label: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  videos?: string[];
  modelUrl?: string;
  fallback360Images?: string[];
  hotspots?: ProductHotspot[];
  category: 'camera' | 'lens' | 'accessory' | 'bundle';
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  lowStock?: boolean;
  badges?: ('new' | 'hot' | 'sale')[];
  specs?: {
    [key: string]: string;
  };
  variants?: ProductVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
