import { useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PayPalButtonProps {
  amount: number;
  plan: string;
  onSuccess: () => void;
}

export function PayPalButton({ amount, plan, onSuccess }: PayPalButtonProps) {
  const initialOptions = {
    clientId: "ASLJLv2Gq7MwNS6-wPSinfiIwk2g5i4aInsooZ3PUmiuZcSjqshGwYzqapEBxPOP1amfZhb7VYLdUFsz",
    currency: "INR",
    intent: "subscription"
  };

  const createSubscription = async (subscriptionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // First check if user already has an active subscription
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (existingSub) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            plan,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            payment_id: subscriptionId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSub.id);

        if (updateError) throw updateError;
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            payment_id: subscriptionId
          });

        if (insertError) throw insertError;
      }

      // Create notification for admin
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'New Subscription',
          message: `User ${user.email} subscribed to ${plan} plan`,
          type: 'subscription',
          data: { plan, subscriptionId }
        });

      onSuccess();
      toast.success('Subscription activated successfully');
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to activate subscription');
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: plan, // This should match your PayPal plan ID
            custom_id: `${plan}_${Date.now()}`,
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
          });
        }}
        onApprove={async (data, actions) => {
          await createSubscription(data.subscriptionID);
        }}
        onError={(err) => {
          console.error('PayPal Error:', err);
          toast.error('Payment failed. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
}