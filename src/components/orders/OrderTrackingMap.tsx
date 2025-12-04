import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, Clock, Truck, Navigation2, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
}

interface OrderTracking {
  orderId: string;
  orderNumber: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  deliveryPartner: DeliveryPartner;
  estimatedDelivery: string;
  progressPercentage: number;
  lastUpdate: string;
}

interface OrderTrackingMapProps {
  order: OrderTracking;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTrackingMap({ order, isOpen, onClose }: OrderTrackingMapProps) {
  const [liveLocation, setLiveLocation] = useState(order.deliveryPartner.currentLocation);
  const [markerPosition, setMarkerPosition] = useState({ x: 20, y: 30 });

  useEffect(() => {
    if (!isOpen) return;

    // Simulate real-time location updates moving towards destination
    const interval = setInterval(() => {
      setLiveLocation(prev => {
        const latDiff = order.deliveryPartner.deliveryLocation.latitude - prev.latitude;
        const lonDiff = order.deliveryPartner.deliveryLocation.longitude - prev.longitude;
        
        return {
          latitude: prev.latitude + latDiff * 0.05,
          longitude: prev.longitude + lonDiff * 0.05,
        };
      });

      // Update marker position on canvas
      setMarkerPosition(prev => ({
        x: prev.x + Math.random() * 4 - 2,
        y: prev.y + Math.random() * 4 - 2,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, order.deliveryPartner.deliveryLocation]);

  const calculateDistance = () => {
    const R = 6371; // Earth's radius in km
    const lat1 = liveLocation.latitude;
    const lon1 = liveLocation.longitude;
    const lat2 = order.deliveryPartner.deliveryLocation.latitude;
    const lon2 = order.deliveryPartner.deliveryLocation.longitude;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const distance = calculateDistance();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation2 className="h-5 w-5 text-blue-500" />
            Track Your Delivery
          </DialogTitle>
          <DialogDescription>Order #{order.orderNumber}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Interactive Map Visualization */}
          <div className="relative w-full h-[400px] rounded-lg border border-border overflow-hidden bg-gradient-to-br from-blue-50 to-blue-50/30">
            {/* Map background with grid */}
            <svg className="w-full h-full" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
              {/* Grid pattern */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#bfdbfe" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Destination marker */}
              <g>
                <circle cx="550" cy="80" r="12" fill="#10b981" opacity="0.3" />
                <circle cx="550" cy="80" r="8" fill="#10b981" />
                <text x="550" y="85" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">🎯</text>
              </g>

              {/* Delivery boy marker with animation */}
              <motion.g
                animate={{ 
                  x: [0, 10, -10, 0],
                  y: [0, -5, 5, 0]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <circle cx={markerPosition.x + 100} cy={markerPosition.y + 200} r="14" fill="#3b82f6" opacity="0.3" />
                <circle cx={markerPosition.x + 100} cy={markerPosition.y + 200} r="10" fill="#3b82f6" />
                <text x={markerPosition.x + 100} y={markerPosition.y + 205} textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">🛵</text>
              </motion.g>

              {/* Route line */}
              <line 
                x1={markerPosition.x + 100} 
                y1={markerPosition.y + 200} 
                x2="550" 
                y2="80" 
                stroke="#3b82f6" 
                strokeWidth="3" 
                strokeDasharray="5,5" 
                opacity="0.6"
              />
            </svg>

            {/* Map overlay info */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="gap-1">
                <Map className="h-3 w-3" />
                Live Tracking
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Delivery Partner Info */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 border-blue-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Delivery Partner
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">{order.deliveryPartner.name}</p>
                  <Badge variant="outline" className="mt-1">
                    {order.deliveryPartner.vehicle}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <a href={`tel:${order.deliveryPartner.phone}`} className="text-sm text-blue-600 hover:underline">
                    {order.deliveryPartner.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Rating: </span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{order.deliveryPartner.rating}/5</span>
                </div>
              </div>
            </Card>

            {/* Delivery Info */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-50/50 border-green-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600" />
                Delivery Details
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Distance Remaining</p>
                  <p className="text-sm font-medium">{distance} km away</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Estimated Delivery</p>
                  <p className="text-sm font-medium">{order.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Last Updated</p>
                  <p className="text-xs text-muted-foreground">{order.lastUpdate}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Delivery Progress</p>
              <span className="text-sm font-semibold text-blue-600">{order.progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${order.progressPercentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Order Confirmed</span>
              <span>In Transit</span>
              <span>Delivered</span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Status Timeline</p>
            <div className="space-y-2">
              {['Order Confirmed', 'Package Picked', 'Out for Delivery'].map((status, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                  <span>{status}</span>
                  <Clock className="h-3 w-3 text-gray-400 ml-auto" />
                </motion.div>
              ))}
              {order.status !== 'delivered' && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    ⟳
                  </div>
                  <span className="font-medium">Almost There!</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1 gap-2">
              <Phone className="h-4 w-4" />
              Call Delivery Partner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
