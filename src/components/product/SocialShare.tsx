import { Share2, MessageCircle, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SocialShareProps {
  productName: string;
  productSlug: string;
  productPrice?: number;
}

export const SocialShare = ({ productName, productSlug, productPrice }: SocialShareProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/product/${productSlug}`;
  };

  const shareText = `Check out this amazing ${productName}${productPrice ? ` at ₹${productPrice}` : ''}!`;

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getShareUrl();
    const encodedText = encodeURIComponent(`${shareText} ${url}`);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleFacebookShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getShareUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
    toast.success('Opening Facebook...');
  };

  const handleTwitterShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getShareUrl();
    const encodedText = encodeURIComponent(`${shareText} ${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    toast.success('Opening Twitter...');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        onClick={(e) => {
          e.preventDefault();
          setShowOptions(!showOptions);
        }}
      >
        <Share2 className="h-4 w-4" />
        <span className="text-xs">Share</span>
      </Button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-3 z-50 w-56"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Share on:</p>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium flex-1 text-left">WhatsApp</span>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center">
                  <Facebook className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium flex-1 text-left">Facebook</span>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>

              {/* Twitter */}
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#000000] rounded-full flex items-center justify-center">
                  <Twitter className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium flex-1 text-left">Twitter/X</span>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>

              <div className="border-t border-border my-2"></div>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors group text-xs"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-semibold">
                  🔗
                </span>
                <span className="font-medium flex-1 text-left">Copy Link</span>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
