import React from 'react';
import { View } from 'lucide-react';
import { ARQuickLook } from './ARQuickLook';
import { getProductModels } from '@/lib/productModels';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ProductARViewProps {
  productId: string;
  fallbackImage: string;
}

export function ProductARView({ productId, fallbackImage }: ProductARViewProps) {
  const models = getProductModels(productId);

  if (!models) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
          <View className="mr-2 h-4 w-4" />
          View in 3D/AR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] sm:h-[600px]">
        <DialogHeader>
          <DialogTitle>3D/AR View</DialogTitle>
          <DialogDescription>
            View this product in 3D or AR on compatible devices
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <ARQuickLook
            modelUrl={models.usdz}
            glbUrl={models.glb}
            fallbackImage={fallbackImage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}