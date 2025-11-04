import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { api } from '@/lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function CheckoutForm({ orderType = 'purchase' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/checkout', {
        items,
        orderType,
      });

      const { sessionId } = response.data;
      const stripe = await stripePromise;
      
      const { error } = await stripe?.redirectToCheckout({
        sessionId,
      });

      if (error) throw error;
      
      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRental = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/checkout/rental', {
        items,
        depositAmount: total * 0.2, // 20% deposit
      });

      const { clientSecret, orderId } = response.data;
      
      // Store orderId for later use
      sessionStorage.setItem('rentalOrderId', orderId);
      
      navigate('/checkout/rental', { 
        state: { clientSecret } 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <Button
          onClick={handleCheckout}
          disabled={loading || !items.length}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Checkout'}
        </Button>

        {orderType === 'rental' && (
          <Button
            onClick={handleRental}
            disabled={loading || !items.length}
            variant="outline"
            className="w-full"
          >
            Rent with Deposit
          </Button>
        )}
      </div>
    </div>
  );
}

export function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}