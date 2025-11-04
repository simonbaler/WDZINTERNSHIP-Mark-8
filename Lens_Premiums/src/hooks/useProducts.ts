import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchProductById } from '@/lib/api';
import { API_CONFIG } from '@/config/api';
import { Product } from '@/types/product';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      // fetchProducts returns a different Product shape from our frontend Product type.
      // Cast via unknown to avoid unsafe direct cast warnings and then normalize if needed.
      const data = (await fetchProducts()) as unknown;
      return (data as Product[]) || [];
    },
  });
};

export function useProduct(id: number) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      const data = (await fetchProductById(id)) as unknown;
      const prod = data as Product | undefined | null;
      if (!prod) throw new Error('Product not found');
      return prod;
    },
    enabled: !!id,
  });
}

// Featured products from our backend
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const data = await fetchProducts();
      // Return first 4 products as featured
      return data.slice(0, 4) || [];
    },
  });
}

// Create product using our backend API
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
      category?: string;
      stock?: number;
    }) => {
      const response = await fetch(`${API_CONFIG.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Update product using our backend API
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Record<string, any>) => {
      const response = await fetch(`${API_CONFIG.baseUrl}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Delete product using our backend API
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_CONFIG.baseUrl}/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
