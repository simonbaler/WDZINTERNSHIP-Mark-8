import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ImageIcon, Sparkles, ArrowRight } from "lucide-react";

export function ImageGeneratorBanner() {
  return (
    <Card className="p-6 bg-gradient-to-r from-fuchsia-50 via-purple-50 to-pink-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-pink-950 border-fuchsia-200 dark:border-fuchsia-800">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-fuchsia-500 rounded-lg text-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">AI Image Generator Available</h3>
            <span className="text-xs bg-fuchsia-500 text-white px-2 py-1 rounded-full">NEW</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Generate professional, studio-quality 3D product images for all your camera products using AI. 
            Create front, back, side, and top views in minutes with ultra-realistic results.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/admin/image-generator">
              <Button size="sm" className="bg-fuchsia-500 hover:bg-fuchsia-600">
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Images
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="/AI_IMAGES_GUIDE.md" target="_blank">
              <Button size="sm" variant="outline">
                View Guide
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
