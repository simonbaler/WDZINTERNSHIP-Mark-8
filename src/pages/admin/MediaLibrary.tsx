import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Box, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaLibrary() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const { data, error } = await (supabase as any)
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load media');
      console.error(error);
    } else {
      setMedia(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get signed URL
      const { data: signedData, error: signedError } = await supabase.functions.invoke(
        'media-signed-upload',
        {
          body: {
            filename: file.name,
            contentType: file.type,
            mediaType: file.type.startsWith('image/') ? 'image' : 'glb',
          },
        }
      );

      if (signedError) throw signedError;

      // Upload file
      const uploadResponse = await fetch(signedData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');

      // Notify processing
      await supabase.functions.invoke('media-process-notify', {
        body: { mediaId: signedData.mediaId, fileSize: file.size },
      });

      toast.success('File uploaded successfully!');
      loadMedia();
    } catch (error) {
      toast.error('Upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*,.glb,.usdz"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Button asChild disabled={uploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload Media
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <Card key={item.id}>
            <CardHeader className="p-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                {item.media_type === 'image' ? (
                  <img src={item.cdn_url} alt={item.original_filename} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Box className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardTitle className="text-sm truncate">{item.original_filename}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <Badge variant={item.processing_status === 'completed' ? 'default' : 'secondary'}>
                {item.processing_status}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {(item.file_size / 1024).toFixed(1)} KB
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
