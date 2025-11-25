import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-12-20',
    total: '₹1,70,999',
    status: 'delivered',
    items: [
      { name: 'Canon EOS R5', image: 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b?w=100' }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-12-22',
    total: '₹45,999',
    status: 'shipped',
    items: [
      { name: 'Sony 24-70mm Lens', image: 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b?w=100' }
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-12-24',
    total: '₹89,999',
    status: 'processing',
    items: [
      { name: 'Fujifilm X-T4', image: 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b?w=100' }
    ]
  }
];

const statusConfig = {
  processing: { label: 'Processing', icon: Package, color: 'bg-yellow-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-blue-500' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-500' }
};

export default function Orders() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Orders</h2>

      {mockOrders.map((order) => {
        const status = statusConfig[order.status as keyof typeof statusConfig];
        const StatusIcon = status.icon;

        return (
          <div key={order.id} className="bg-card rounded-lg border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold">{order.id}</h3>
                  <Badge variant="secondary" className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-lg font-bold">{order.total}</span>
            </div>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <span className="flex-1">{item.name}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">View Details</Button>
              {order.status === 'delivered' && (
                <Button variant="outline" size="sm">Request Return</Button>
              )}
              {order.status === 'shipped' && (
                <Button variant="outline" size="sm">Track Order</Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
