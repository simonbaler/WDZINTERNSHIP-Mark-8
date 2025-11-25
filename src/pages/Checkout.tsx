import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 4999 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place order');
      navigate('/auth');
      return;
    }

    try {
      // TODO: Implement actual order creation when backend is ready
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/account/orders');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= num
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {num}
              </div>
              <span className={step >= num ? 'text-foreground' : 'text-muted-foreground'}>
                {num === 1 ? 'Shipping' : num === 2 ? 'Payment' : 'Confirmation'}
              </span>
              {num < 3 && <div className="w-12 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-lg border p-6 space-y-6"
              >
                <h2 className="text-2xl font-bold">Shipping Address</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe"
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Street address" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="Maharashtra" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="400001" />
                  </div>
                </div>

                <Button size="lg" className="w-full" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-lg border p-6 space-y-6"
              >
                <h2 className="text-2xl font-bold">Payment Method</h2>

                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Credit/Debit Card</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">UPI</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex-1 cursor-pointer">
                      Net Banking
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" type="password" placeholder="123" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Your payment information is secure</span>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button size="lg" className="flex-1" onClick={() => setStep(3)}>
                    Review Order
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-lg border p-6 space-y-6"
              >
                <h2 className="text-2xl font-bold">Review Order</h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium">₹{item.product.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{tax.toFixed(0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button size="lg" className="flex-1" onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-lg border p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({items.length})</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
