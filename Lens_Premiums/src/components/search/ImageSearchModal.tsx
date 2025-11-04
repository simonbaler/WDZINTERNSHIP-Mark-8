import React, { useCallback, useState } from 'react';
import { Product } from '@/types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Upload } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { ProductCard } from '../products/ProductCard';
import { AspectRatio } from '../ui/aspect-ratio';
import { Label } from '../ui/label';

export function ImageSearchModal() {
  const [searchImage, setSearchImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { data: products = [] } = useProducts();
  const typedProducts = products as Product[]; // ensure TS understands this is our frontend Product type
  const [searchResults, setSearchResults] = useState<Product[]>(() => (typedProducts ?? []).slice(0, 4)); // Mock results for now

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSearchImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchImage) return;
    
    setIsSearching(true);
    try {
      // TODO: Implement actual image search logic here
      // For now, just simulate a search delay and return mock results
      await new Promise(resolve => setTimeout(resolve, 1500));
  setSearchResults((typedProducts ?? []).slice(0, 4));
    } finally {
      setIsSearching(false);
    }
  }, [searchImage, products]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search by image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Search by Image</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Upload an image to search for similar products</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className={cn(
                    "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4",
                    previewUrl ? "border-muted" : "border-primary"
                  )}
                >
                  {previewUrl ? (
                    <AspectRatio ratio={1}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </AspectRatio>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="h-8 w-8" />
                      <span>Drop an image here or click to upload</span>
                    </div>
                  )}
                </Label>
                <Button
                  onClick={handleSearch}
                  disabled={!searchImage || isSearching}
                  className="w-full"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h4 className="font-medium">Similar Products</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}