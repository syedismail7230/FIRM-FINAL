import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Lock, Key, Shield } from 'lucide-react';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First step: Email/Password authentication
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('invalid_credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        }
        throw signInError;
      }

      if (!user) {
        throw new Error('Authentication failed. Please try again.');
      }

      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', email)
        .limit(1);

      if (adminError) {
        throw new Error('Error checking administrator privileges. Please try again.');
      }

      if (!adminData || adminData.length === 0) {
        throw new Error('Access denied. This account does not have administrator privileges.');
      }

      const admin = adminData[0];

      // If 2FA not set up, generate secret and show QR code
      if (!admin.two_factor_secret) {
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(email, 'Firm AI Admin', secret);
        const qrCode = await QRCode.toDataURL(otpauth);
        
        setQrCodeUrl(qrCode);
        setShowOTP(true);
        
        // Save secret
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ two_factor_secret: secret })
          .eq('username', email);

        if (updateError) {
          throw new Error('Failed to set up two-factor authentication. Please try again.');
        }
      } else {
        setShowOTP(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message);
      setShowOTP(false);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('two_factor_secret')
        .eq('username', email)
        .limit(1);

      if (adminError) {
        throw new Error('Error verifying code. Please try again.');
      }

      if (!adminData || adminData.length === 0 || !adminData[0].two_factor_secret) {
        throw new Error('Two-factor authentication setup required. Please contact system administrator.');
      }

      const isValid = authenticator.verify({
        token: otpCode,
        secret: adminData[0].two_factor_secret
      });

      if (!isValid) {
        throw new Error('Invalid verification code. Please try again.');
      }

      toast.success('Login successful');
      // Redirect to admin dashboard
      window.location.href = '/admin';
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Shield className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please use your administrator credentials
          </p>
        </div>

        {!showOTP ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Admin email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            {qrCodeUrl && (
              <div className="text-center">
                <p className="mb-4 text-sm text-gray-600">
                  Scan this QR code with your authenticator app to set up two-factor authentication
                </p>
                <img src={qrCodeUrl} alt="2FA QR Code" className="mx-auto" />
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="otp" className="sr-only">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter verification code"
                />
              </div>
            </div>

            <div>
              <button
                onClick={verifyOTP}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Key className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                Verify Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}