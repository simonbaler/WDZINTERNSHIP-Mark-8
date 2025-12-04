import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UserOrderDetail() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold">Order Detail</h2>
        <p className="text-muted-foreground mt-2">Your order information and tracking</p>
        <div className="mt-4">
          <Badge>Shipped</Badge>
        </div>
      </Card>
    </div>
  );
}
