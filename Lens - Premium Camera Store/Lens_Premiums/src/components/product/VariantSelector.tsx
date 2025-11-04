import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Variant {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: string;
  onVariantChange: (variantId: string) => void;
}

export function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
  if (!variants || variants.length <= 1) return null;

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Select Option:</Label>
      <RadioGroup value={selectedVariant} onValueChange={onVariantChange}>
        <div className="grid gap-3">
          {variants.map((variant) => (
            <div key={variant.id} className="flex items-center space-x-3">
              <RadioGroupItem value={variant.id} id={variant.id} disabled={variant.inventory === 0} />
              <Label
                htmlFor={variant.id}
                className={`flex-1 flex justify-between cursor-pointer ${
                  variant.inventory === 0 ? 'opacity-50' : ''
                }`}
              >
                <span>{variant.name}</span>
                <span className="font-semibold">
                  {variant.inventory === 0 ? 'Out of Stock' : `₹${variant.price.toLocaleString()}`}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
