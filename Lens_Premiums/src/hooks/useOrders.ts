import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '@/config/api';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: any;
  payment_method?: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export function useOrders() {
  const baseUrl = API_CONFIG.baseUrl;

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/orders`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return (await response.json()) as Order[];
    },
  });
}

export function useOrder(id: string) {
  const baseUrl = API_CONFIG.baseUrl;

  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/orders/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      return (await response.json()) as Order;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const baseUrl = API_CONFIG.baseUrl;

  return useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  const baseUrl = API_CONFIG.baseUrl;

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Order> & { id: string }) => {
      const response = await fetch(`${baseUrl}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const baseUrl = API_CONFIG.baseUrl;

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const response = await fetch(`${baseUrl}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}
