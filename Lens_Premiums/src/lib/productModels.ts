export const productModels = {
  'camera-1': {
    glb: '/models/camera-1.glb',
    usdz: '/models/camera-1.usdz'
  },
  'camera-2': {
    glb: '/models/camera-2.glb',
    usdz: '/models/camera-2.usdz'
  },
  'lens-1': {
    glb: '/models/lens-1.glb',
    usdz: '/models/lens-1.usdz'
  }
};

export function getProductModels(productId: string) {
  return productModels[productId as keyof typeof productModels] || null;
}