import { motion } from 'framer-motion';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCompareStore } from '@/store/compareStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

export default function Compare() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const navigate = useNavigate();
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [budget, setBudget] = useState('');
  const [requirements, setRequirements] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No products to compare</h2>
          <p className="text-muted-foreground mb-6">Add products to compare them side by side</p>
          <Button onClick={() => navigate('/cameras')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const handleAISuggest = async () => {
    if (items.length < 2) {
      toast.error('Add at least 2 products to compare');
      return;
    }

    setIsLoadingAI(true);
    setShowAISuggestion(true);

    try {
      const { data, error } = await supabase.functions.invoke('compare-products', {
        body: { 
          products: items,
          budget: budget ? parseInt(budget) : null,
          requirements: requirements || 'General photography'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setAiSuggestion(data.suggestion);
      toast.success('AI analysis complete!');
    } catch (error: any) {
      console.error('AI suggestion error:', error);
      toast.error(error.message || 'Failed to get AI suggestion');
      setShowAISuggestion(false);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const specs = items[0]?.specs ? Object.keys(items[0].specs) : [];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Compare Products</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAISuggest} disabled={isLoadingAI || items.length < 2}>
              {isLoadingAI ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Suggest Best
                </>
              )}
            </Button>
            <Button variant="destructive" onClick={clearCompare}>
              Clear All
            </Button>
          </div>
        </div>

        {/* AI Suggestion Card */}
        {showAISuggestion && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="flex items-start gap-4">
                <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">AI Recommendation</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="budget">Budget (Optional)</Label>
                        <Input 
                          id="budget"
                          type="number" 
                          placeholder="₹200000" 
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="requirements">Requirements (Optional)</Label>
                        <Input 
                          id="requirements"
                          placeholder="Wildlife photography, low light..." 
                          value={requirements}
                          onChange={(e) => setRequirements(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  {aiSuggestion && (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {aiSuggestion}
                      </div>
                    </div>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowAISuggestion(false)}
                    className="mt-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => removeFromCompare(product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />

                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{product.brand}</p>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold">₹{product.price.toLocaleString()}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>

                  {product.badges && (
                    <div className="flex gap-2">
                      {product.badges.map((badge) => (
                        <Badge key={badge} variant="secondary">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t space-y-2">
                    {specs.map((spec) => (
                      <div key={spec} className="text-sm">
                        <span className="font-medium capitalize">{spec}:</span>
                        <span className="ml-2 text-muted-foreground">
                          {product.specs?.[spec] || 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
