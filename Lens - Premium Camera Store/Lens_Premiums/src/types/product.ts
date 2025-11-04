export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  models?: {
    glb?: string;
    usdz?: string;
  };
  category: 'cameras' | 'lenses' | 'accessories' | 'bundles';
  subcategory?: string;
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
