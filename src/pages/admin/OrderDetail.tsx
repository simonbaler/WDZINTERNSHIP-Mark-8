import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminOrderDetail() {
  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Order Detail</h1>
        <p className="text-muted-foreground mt-2">Admin view of a single order</p>
        <div className="mt-4">
          <Badge>Processing</Badge>
        </div>
      </Card>
    </div>
  );
}
