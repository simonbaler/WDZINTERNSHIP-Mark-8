import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProductsStore } from "@/store/productsStore";
import { Loader2, Image as ImageIcon, Download } from "lucide-react";

interface GeneratedImage {
  productId: string;
  productName: string;
  angle: string;
  imageUrl: string;
}

export default function ProductImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProduct, setCurrentProduct] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

const cameraProducts = useProductsStore((s) => s.products).filter(p => p.category === 'camera');
  const angles = ['front', 'back', 'side', 'top'];

  const generateAllImages = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);

    const totalImages = cameraProducts.length * angles.length;
    let completedImages = 0;

    for (const product of cameraProducts) {
      setCurrentProduct(`${product.brand} ${product.name}`);

      for (const angle of angles) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-product-images', {
            body: {
              productName: product.name,
              productBrand: product.brand,
              productType: 'camera',
              angle: angle
            }
          });

          if (error) throw error;

          if (data?.imageUrl) {
            setGeneratedImages(prev => [...prev, {
              productId: product.id,
              productName: product.name,
              angle: angle,
              imageUrl: data.imageUrl
            }]);
            toast.success(`Generated ${angle} view for ${product.name}`);
          }

          completedImages++;
          setProgress((completedImages / totalImages) * 100);

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Error generating ${angle} for ${product.name}:`, error);
          toast.error(`Failed to generate ${angle} view for ${product.name}`);
        }
      }
    }

    setIsGenerating(false);
    setCurrentProduct("");
    toast.success(`Generated ${completedImages} images!`);
  };

  const generateSingleProduct = async (product: typeof cameraProducts[0]) => {
    setIsGenerating(true);
    setCurrentProduct(`${product.brand} ${product.name}`);

    let count = 0;
    for (const angle of angles) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-product-images', {
          body: {
            productName: product.name,
            productBrand: product.brand,
            productType: 'camera',
            angle: angle
          }
        });

        if (error) throw error;

        if (data?.imageUrl) {
          setGeneratedImages(prev => [...prev, {
            productId: product.id,
            productName: product.name,
            angle: angle,
            imageUrl: data.imageUrl
          }]);
          count++;
          toast.success(`Generated ${angle} view`);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error generating ${angle}:`, error);
        toast.error(`Failed to generate ${angle} view`);
      }
    }

    setIsGenerating(false);
    setCurrentProduct("");
    toast.success(`Generated ${count} images for ${product.name}`);
  };

  const downloadImagesData = () => {
    const dataStr = JSON.stringify(generatedImages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'generated-images.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Product Image Generator</h1>
        <p className="text-muted-foreground">
          Generate realistic 3D product images for all camera products using AI
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Bulk Generation</h3>
              <p className="text-sm text-muted-foreground">
                Generate images for all {cameraProducts.length} camera products ({cameraProducts.length * 4} total images)
              </p>
            </div>
            <Button
              onClick={generateAllImages}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate All Images
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Currently generating: {currentProduct}
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>
      </Card>

      {generatedImages.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generated Images ({generatedImages.length})</h3>
            <Button variant="outline" onClick={downloadImagesData}>
              <Download className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedImages.map((img, idx) => (
              <div key={idx} className="space-y-2">
                <img
                  src={img.imageUrl}
                  alt={`${img.productName} - ${img.angle}`}
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <div className="text-xs">
                  <p className="font-medium truncate">{img.productName}</p>
                  <p className="text-muted-foreground capitalize">{img.angle} view</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Individual Product Generation</h3>
        <div className="grid gap-3">
          {cameraProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{product.brand} {product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.specs.sensor} • {product.specs.video}
                </p>
              </div>
              <Button
                onClick={() => generateSingleProduct(product)}
                disabled={isGenerating}
                variant="outline"
                size="sm"
              >
                {isGenerating && currentProduct === `${product.brand} ${product.name}` ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
