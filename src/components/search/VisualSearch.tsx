import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function VisualSearch() {
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    // Convert to base64 for API
    const base64 = await fileToBase64(file);
    
    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-visual', {
        body: { imageBase64: base64.split(',')[1], limit: 12 },
      });

      if (error) throw error;

      setResults(data.results || []);
      toast.success(`Found ${data.count} similar products`);
    } catch (error) {
      toast.error('Visual search failed');
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Image className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visual Search</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              id="visual-search-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={searching}
            />
            <label htmlFor="visual-search-upload" className="cursor-pointer">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-4" />
              ) : (
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                {searching ? 'Searching...' : 'Click to upload an image or drag and drop'}
              </p>
            </label>
          </div>

          {/* Results */}
          {searching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {results.map((result) => (
                <a
                  key={result.product_id}
                  href={`/product/${result.product_data.slug}`}
                  className="block group"
                >
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                    <img
                      src={result.product_data.images?.[0] || '/placeholder.svg'}
                      alt={result.product_data.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-medium truncate">{result.product_data.name}</p>
                  <p className="text-sm text-muted-foreground">₹{result.product_data.price?.toLocaleString()}</p>
                  <p className="text-xs text-primary">{(result.similarity * 100).toFixed(1)}% match</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
