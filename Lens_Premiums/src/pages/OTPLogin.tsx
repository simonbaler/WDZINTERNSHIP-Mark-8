import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function OTPLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const { requestOTP, verifyOTP, otpSent } = useAuth();
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add +91 prefix if not present
    const formattedPhone = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber}`;

    const result = await requestOTP(formattedPhone);
    
    if (result.success) {
      toast.success('OTP sent successfully');
    } else {
      toast.error(result.error || 'Failed to send OTP');
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add +91 prefix if not present
    const formattedPhone = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber}`;

    const result = await verifyOTP(formattedPhone, otp);
    
    if (result.success) {
      toast.success('Login successful');
      navigate('/');
    } else {
      toast.error(result.error || 'Invalid OTP');
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login with Phone</CardTitle>
          <CardDescription>
            Enter your Indian phone number to receive an OTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Remove any non-digit characters except +
                    const cleaned = e.target.value.replace(/[^\d+]/g, '');
                    setPhoneNumber(cleaned);
                  }}
                  className="text-lg"
                  maxLength={13} // +91 + 10 digits
                />
                <p className="text-sm text-gray-500">
                  Format: +91XXXXXXXXXX or XXXXXXXXXX
                </p>
              </div>
              <Button type="submit" className="w-full">
                Get OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    // Remove any non-digit characters
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setOtp(cleaned);
                  }}
                  className="text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOtp('');
                  handlePhoneSubmit(new Event('submit') as any);
                }}
              >
                Resend OTP
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}