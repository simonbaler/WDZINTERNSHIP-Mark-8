/**
 * Rental Checkout Component
 * 
 * This component handles the rental checkout flow, including:
 * - Displaying rental terms
 * - Collecting deposit
 * - Setting rental duration
 * - Scheduling return
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Elements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { DayPicker } from 'react-day-picker';
import { stripePromise } from '@/lib/stripe';
import { PaymentMethods } from './PaymentMethods';
import { api } from '@/lib/api';
import { useCart } from '@/hooks/useCart';

// Form validation schema
const rentalSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  agreeToTerms: z.boolean().refine(val => val, {
    message: 'You must agree to the rental terms'
  })
});

type RentalFormData = z.infer<typeof rentalSchema>;

export function RentalCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const { items, total } = useCart();
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date; }>({ from: undefined, to: undefined });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema)
  });

  // Calculate deposit amount (20% of total)
  const depositAmount = Math.ceil(total * 0.2);

  const onSubmit = async (data: RentalFormData) => {
    try {
      setLoading(true);
      setError('');

      // Create rental order with deposit
      const response = await api.post('/checkout/rental', {
        items,
        depositAmount,
        rentalPeriod: {
          start: data.startDate,
          end: data.endDate
        }
      });

      // Get client secret for payment
      setClientSecret(response.data.clientSecret);

    } catch (err) {
      setError('Failed to create rental order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Rental Terms */}
      <div className="prose">
        <h2>Rental Terms</h2>
        <ul>
          <li>Rental period: {selectedRange.from && selectedRange.to ? 
            `${format(selectedRange.from, 'PPP')} to ${format(selectedRange.to, 'PPP')}` : 'Select dates'}</li>
          <li>Required deposit: ${depositAmount / 100}</li>
          <li>Return by: End of rental period</li>
          <li>Late fees: $50/day</li>
        </ul>
      </div>

      {/* Rental Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        {/* Date Selection */}
        <div className="space-y-4">
          <DayPicker
            mode="range"
            defaultMonth={new Date()}
            selected={selectedRange as any}
            onSelect={(range) => {
              setSelectedRange(range || { from: undefined, to: undefined });
              if (range?.from) register('startDate').onChange({ target: { value: range.from } });
              if (range?.to) register('endDate').onChange({ target: { value: range.to } });
            }}
            numberOfMonths={2}
          />
        </div>

        {/* Terms Agreement */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('agreeToTerms')}
          />
          <label>I agree to the rental terms and conditions</label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-sm">
            {errors.agreeToTerms.message}
          </p>
        )}

        {/* Payment Section */}
        {clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <PaymentMethods
              clientSecret={clientSecret}
              onSuccess={() => {
                // Handle successful payment
              }}
              onError={() => setError('Payment failed')}
            />
          </Elements>
        ) : (
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </Button>
        )}
      </form>
    </div>
  );
}