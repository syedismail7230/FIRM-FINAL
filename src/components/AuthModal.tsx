import React, { useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const startCooldownTimer = () => {
    setIsSubmitting(true);
    setCooldownTimer(55);
    
    const timer = setInterval(() => {
      setCooldownTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleError = (error: Error) => {
    console.error('Auth error:', error);
    
    // Extract the error message if it's a JSON string
    let errorMessage = error.message;
    try {
      const errorObj = JSON.parse(error.message);
      errorMessage = errorObj.message || errorMessage;
    } catch (e) {
      // Not JSON, use the original message
    }

    if (errorMessage.includes('rate_limit')) {
      startCooldownTimer();
      toast.error('Too many attempts. Please wait before trying again.');
    } else if (errorMessage.includes('invalid_credentials')) {
      toast.error('Invalid email or password. Please check your credentials.');
    } else if (errorMessage.includes('user_already_exists')) {
      toast.error('This email is already registered. Please sign in instead.');
    } else if (errorMessage.includes('Email not confirmed')) {
      toast.error('Please check your email and confirm your account before signing in.');
    } else {
      toast.error(errorMessage || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sign In / Sign Up</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {isSubmitting && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-indigo-600">
              Please wait {cooldownTimer} seconds before trying again...
            </span>
          </div>
        )}

        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-600">
            <p className="font-medium mb-1">Important:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use a valid email address</li>
              <li>Password must be at least 6 characters</li>
              <li>New accounts require admin approval</li>
            </ul>
          </div>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4f46e5',
                  brandAccent: '#4338ca'
                }
              }
            }
          }}
          providers={[]}
          onError={handleError}
          redirectTo={window.location.origin}
          onSignUp={async ({ user }) => {
            if (user) {
              await createUserProfile(user);
              toast.success('Account created successfully. Please wait for admin approval.');
            }
          }}
        />

        {/* Password Reset Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              if (isSubmitting) {
                toast.error('Please wait before requesting a password reset');
                return;
              }
              const email = prompt('Enter your email address to reset your password:');
              if (!email) return;
              
              supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
              }).then(() => {
                toast.success('Password reset instructions sent to your email');
              }).catch((error) => {
                handleError(error);
              });
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800"
            disabled={isSubmitting}
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
}