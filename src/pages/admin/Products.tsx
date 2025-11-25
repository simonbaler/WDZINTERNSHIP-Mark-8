import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useProductsStore } from '@/store/productsStore';
import { Product } from '@/types/product';
import { generate3DModelFromImage } from '@/lib/gemini';

export default function Products() {
  const products = useProductsStore((s) => s.products);
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    category: 'camera',
    brand: '',
    price: 0,
    imagesText: '', // comma-separated image URLs
    videosText: '', // comma-separated video URLs
    modelUrl: '',
    inStock: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const openAddDialog = () => {
    setEditingProduct(null);
    setForm({ name: '', category: 'camera', brand: '', price: 0, imagesText: '', videosText: '', modelUrl: '', inStock: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      imagesText: (product.images ?? []).join(', '),
      videosText: (product.videos ?? []).join(', '),
      modelUrl: product.modelUrl ?? '',
      inStock: product.inStock ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) {
      toast.error('Please fill in name, category, and price');
      return;
    }

    const images = form.imagesText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const videos = form.videosText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (images.length < 5) {
      toast.error('Please upload at least 5 images of the product');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: form.name,
        category: form.category as Product['category'],
        brand: form.brand,
        price: Number(form.price),
        images: images.length > 0 ? images : editingProduct.images,
        videos: videos.length > 0 ? videos : editingProduct.videos,
        modelUrl: form.modelUrl || undefined,
        inStock: form.inStock,
      });
      toast.success('Product updated');

      if (!form.modelUrl && (images.length > 0 || (editingProduct.images?.length ?? 0) > 0) && !editingProduct.modelUrl) {
        try {
          setIsGenerating(true);
          toast.info('Generating 3D model from image...');
          const firstImage = (images.length > 0 ? images : editingProduct.images!)[0];
          const modelUrl = await generate3DModelFromImage(firstImage);
          if (modelUrl) {
            updateProduct(editingProduct.id, { modelUrl });
            toast.success('3D model generated');
          }
        } catch (e) {
          toast.error('3D model generation failed');
        } finally {
          setIsGenerating(false);
        }
      }
    } else {
      const created = addProduct({
        name: form.name,
        category: form.category as Product['category'],
        brand: form.brand,
        price: Number(form.price),
        images,
        videos,
        modelUrl: form.modelUrl || undefined,
        inStock: form.inStock,
        description: '',
        rating: 0,
        reviewCount: 0,
      });
      toast.success(`Added ${created.name}`);

      if (!form.modelUrl && images.length > 0) {
        try {
          setIsGenerating(true);
          toast.info('Generating 3D model from image...');
          const modelUrl = await generate3DModelFromImage(images[0]);
          if (modelUrl) {
            updateProduct(created.id, { modelUrl });
            toast.success('3D model generated');
          }
        } catch (e) {
          toast.error('3D model generation failed');
        } finally {
          setIsGenerating(false);
        }
      }
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={product.inStock ? 'default' : 'secondary'}>
                    {product.inStock ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">₹{product.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Stock: {Array.isArray(product.variants)
                      ? product.variants.reduce((sum, v) => sum + (v.inventory ?? 0), 0)
                      : product.inStock ? 'Available' : 'Out of stock'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      deleteProduct(product.id);
                      toast.success('Product deleted');
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="lens">Lens</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                    <SelectItem value="bundle">Bundle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="imagesText">Image URLs (comma-separated)</Label>
              <Input
                id="imagesText"
                value={form.imagesText}
                onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                placeholder="https://.../img1.jpg, https://.../img2.png"
              />
            </div>
            <div>
              <Label htmlFor="videosText">Video URLs (comma-separated)</Label>
              <Input
                id="videosText"
                value={form.videosText}
                onChange={(e) => setForm({ ...form, videosText: e.target.value })}
                placeholder="https://.../video1.mp4, https://.../clip2.webm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports common formats like MP4 and WebM. Videos will appear in the gallery alongside images.
              </p>
            </div>
            <div>
              <Label htmlFor="modelUrl">3D Model URL (GLB/GLTF)</Label>
              <Input
                id="modelUrl"
                value={form.modelUrl}
                onChange={(e) => setForm({ ...form, modelUrl: e.target.value })}
                placeholder="https://.../model.glb"
              />
              <p className="text-xs text-muted-foreground mt-1">
                If provided, it will show in the 360° 3D View. If not, we will auto-generate a 3D model from the first image.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isGenerating}>
              {isGenerating ? 'Processing...' : (editingProduct ? 'Save Changes' : 'Add Product')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
