import React, { useState } from 'react';
import { Check, Zap, Shield, Star } from 'lucide-react';
import { PayPalButton } from '../components/PayPalButton';
import { useNavigate } from 'react-router-dom';

export function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: 999,
      description: 'Perfect for small businesses',
      features: [
        '5 Location Analyses/month',
        'Basic Demographics Data',
        'Traffic Analysis',
        'Email Support'
      ]
    },
    {
      name: 'Professional',
      price: 2499,
      description: 'For growing businesses',
      features: [
        '20 Location Analyses/month',
        'Advanced Demographics',
        'Competitor Analysis',
        'Priority Support',
        'API Access'
      ]
    },
    {
      name: 'Enterprise',
      price: 4999,
      description: 'For large organizations',
      features: [
        'Unlimited Analyses',
        'Custom Integration',
        'Dedicated Support',
        'Custom Features',
        'SLA Agreement'
      ]
    }
  ];

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7054528/pexels-photo-7054528.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Choose the plan that best fits your business needs
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className="glass-card p-8">
                <div className="text-center mb-8">
                  <div className="text-indigo-600 mb-4">
                    {plan.name === 'Starter' && <Zap className="w-12 h-12 mx-auto" />}
                    {plan.name === 'Professional' && <Star className="w-12 h-12 mx-auto" />}
                    {plan.name === 'Enterprise' && <Shield className="w-12 h-12 mx-auto" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-4">₹{plan.price}<span className="text-lg text-gray-600">/mo</span></div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {selectedPlan === plan.name ? (
                  <PayPalButton
                    amount={plan.price}
                    plan={plan.name.toLowerCase()}
                    onSuccess={handleSuccess}
                  />
                ) : (
                  <button
                    onClick={() => setSelectedPlan(plan.name)}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}