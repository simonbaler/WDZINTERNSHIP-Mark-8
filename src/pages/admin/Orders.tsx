import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockOrders = [
  { id: 'ORD-1001', customer: 'Alice Johnson', total: 1299.0, status: 'processing', items: 2, date: '2024-06-03' },
  { id: 'ORD-1002', customer: 'Bob Smith', total: 249.0, status: 'shipped', items: 1, date: '2024-06-04' },
  { id: 'ORD-1003', customer: 'Clara Lee', total: 89.0, status: 'pending', items: 3, date: '2024-06-05' },
];

export default function AdminOrders() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {mockOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-sm text-muted-foreground">{o.customer} • {o.date} • {o.items} items</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold">${o.total.toFixed(2)}</div>
                  <Badge variant={o.status === 'shipped' ? 'default' : o.status === 'processing' ? 'secondary' : 'outline'}>{o.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}