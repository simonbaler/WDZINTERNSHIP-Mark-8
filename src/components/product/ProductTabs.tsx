import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProductTabsProps {
  description: string;
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
}

export function ProductTabs({ description, specs, rating, reviewCount }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Tech Specs</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
        <TabsTrigger value="qa">Q&A</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-4 py-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed">{description}</p>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Key Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>Professional-grade full-frame sensor for exceptional image quality</li>
            <li>Advanced autofocus system with subject tracking</li>
            <li>High-resolution video recording capabilities</li>
            <li>Weather-sealed construction for durability</li>
            <li>Extensive lens compatibility and mounting options</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="specs" className="py-6">
        <div className="grid gap-4">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-3 border-b">
              <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-6 py-6">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{rating}</div>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{reviewCount} reviews</p>
          </div>
          
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm w-12">{stars} star</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {Math.round(reviewCount * (stars === 5 ? 0.7 : stars === 4 ? 0.2 : stars === 3 ? 0.05 : stars === 2 ? 0.03 : 0.02))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          {[
            {
              name: 'Rajesh Kumar',
              rating: 5,
              date: '2 weeks ago',
              review: 'Excellent camera! The image quality is outstanding and the autofocus is incredibly fast.',
            },
            {
              name: 'Priya Singh',
              rating: 4,
              date: '1 month ago',
              review: 'Great camera for professional work. Battery life could be better but overall very satisfied.',
            },
          ].map((review, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{review.name}</div>
                  <div className="flex gap-1 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-muted-foreground">{review.review}</p>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="qa" className="space-y-6 py-6">
        <div className="space-y-6">
          {[
            {
              question: 'Is this camera compatible with EF lenses?',
              answer: 'Yes, with an adapter you can use EF lenses on this camera.',
              askedBy: 'Amit P.',
              answeredBy: 'LensCraft Team',
            },
            {
              question: 'What is the battery life?',
              answer: 'Approximately 530 shots per charge with the viewfinder, or 220 shots with the LCD.',
              askedBy: 'Sneha M.',
              answeredBy: 'LensCraft Team',
            },
          ].map((qa, idx) => (
            <div key={idx} className="space-y-3">
              <div>
                <div className="font-semibold mb-1">Q: {qa.question}</div>
                <div className="text-sm text-muted-foreground">Asked by {qa.askedBy}</div>
              </div>
              <div className="pl-6 border-l-2 border-primary">
                <div className="mb-1">A: {qa.answer}</div>
                <div className="text-sm text-muted-foreground">Answered by {qa.answeredBy}</div>
              </div>
              {idx < 1 && <Separator />}
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
