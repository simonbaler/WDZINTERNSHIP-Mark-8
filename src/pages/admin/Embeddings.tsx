import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Embeddings() {
  const [generating, setGenerating] = useState(false);

  const handleGenerateEmbeddings = async () => {
    setGenerating(true);
    toast.info('Embedding generation will be implemented with batch processing');
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Product Embeddings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Embeddings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate vector embeddings for all products to enable semantic and visual search.
          </p>
          <Button onClick={handleGenerateEmbeddings} disabled={generating}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate All Embeddings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
