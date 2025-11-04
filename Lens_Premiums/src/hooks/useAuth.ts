import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { API_CONFIG } from '@/config/api';

type OTPResponse = { success: boolean; message?: string; error?: string };

export function useAuth() {
  const { user, session, setUser, setSession, signOut: storeSignOut } = useAuthStore() as any;
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const baseUrl = API_CONFIG.baseUrl;

  const requestOTP = async (phoneNumber: string): Promise<OTPResponse> => {
    try {
      const response = await fetch(`${baseUrl}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        return { success: true, message: data.message };
      }
      return { success: false, error: data.message || 'Failed to send OTP' };
    } catch (err) {
      return { success: false, error: 'Failed to send OTP' };
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string): Promise<OTPResponse> => {
    try {
      const response = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        const sessionData = { access_token: data.token, expires_at: Date.now() + 24 * 60 * 60 * 1000 };
        const userData = { id: phoneNumber, email: '', phoneNumber };
        localStorage.setItem('session', JSON.stringify(sessionData));
        localStorage.setItem('user', JSON.stringify(userData));
        setSession(sessionData);
        setUser(userData);
        setOtpSent(false);
        return { success: true };
      }
      return { success: false, error: data.message || 'Invalid OTP' };
    } catch (err) {
      return { success: false, error: 'Failed to verify OTP' };
    }
  };

  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    const storedUser = localStorage.getItem('user');
    if (storedSession && storedUser) {
      try {
        const parsedSession = JSON.parse(storedSession);
        const parsedUser = JSON.parse(storedUser);
        setSession(parsedSession);
        setUser(parsedUser);
      } catch (_) {}
    }
    setLoading(false);
  }, [setSession, setUser]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const response = await fetch(`${baseUrl}/users/${userId}/roles`);
      const data = await response.json();
      setIsAdmin(data.isAdmin || false);
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('session', JSON.stringify(data.session));
        localStorage.setItem('user', JSON.stringify(data.user));
        setSession(data.session);
        setUser(data.user);
        return { data, error: null } as any;
      }
      return { data: null, error: data.error || 'Login failed' } as any;
    } catch (err) {
      return { data: null, error: 'Login failed' } as any;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, metadata }),
      });
      const data = await response.json();
      if (response.ok) return { data, error: null };
      return { data: null, error: data.error || 'Registration failed' } as any;
    } catch (err) {
      return { data: null, error: 'Registration failed' } as any;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('session');
      localStorage.removeItem('user');
      storeSignOut();
      setIsAdmin(false);
      return { error: null } as any;
    } catch (err) {
      return { error: 'Sign out failed' } as any;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch(`${baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) return { data, error: null };
      return { data: null, error: data.error || 'Password reset failed' } as any;
    } catch (err) {
      return { data: null, error: 'Password reset failed' } as any;
    }
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    otpSent,
    signIn,
    signUp,
    signOut,
    resetPassword,
    requestOTP,
    verifyOTP,
  } as any;
}
