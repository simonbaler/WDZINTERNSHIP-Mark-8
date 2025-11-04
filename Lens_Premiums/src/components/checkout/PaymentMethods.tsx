/**
 * Payment Methods Component
 * 
 * This component handles displaying and selecting saved payment methods,
 * as well as adding new ones. It uses Stripe Elements for secure
 * payment method input.
 */

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

interface Props {
  clientSecret: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentMethods({ clientSecret, onSuccess, onError }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Confirm the payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/complete`,
        },
      });

      if (result.error) {
        // Handle error
        setError(result.error.message || 'Payment failed');
        onError?.(new Error(result.error.message || 'Payment failed'));
      } else {
        // Payment successful
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Show any errors */}
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      {/* Stripe Elements Component */}
      <PaymentElement 
        options={{
          layout: 'tabs'
        }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Spinner className="mr-2" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
    </form>
  );
}