import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Building2, DollarSign, TrendingUp, MapPin, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface BusinessInterestFormProps {
  user: User;
  onSuccess?: () => void;
}

export function BusinessInterestForm({ user, onSuccess }: BusinessInterestFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    business_type: '',
    investment_amount: '',
    expected_roi: '',
    location_preference: '',
    experience: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('business_interests')
        .insert({
          user_id: user.id,
          business_type: formData.business_type,
          investment_amount: parseFloat(formData.investment_amount),
          expected_roi: parseFloat(formData.expected_roi),
          location_preference: formData.location_preference,
          experience: formData.experience
        });

      if (error) throw error;

      toast.success('Business interest saved successfully');
      setFormData({
        business_type: '',
        investment_amount: '',
        expected_roi: '',
        location_preference: '',
        experience: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving business interest:', error);
      toast.error('Failed to save business interest');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            Business Type
          </label>
          <select
            value={formData.business_type}
            onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select a business type</option>
            <option value="Café">Café</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Retail Store">Retail Store</option>
            <option value="Gym">Gym</option>
            <option value="Coworking Space">Coworking Space</option>
            <option value="Franchise">Franchise</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            Investment Amount (₹)
          </label>
          <input
            type="number"
            value={formData.investment_amount}
            onChange={(e) => setFormData({ ...formData, investment_amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="1000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            Expected ROI (%)
          </label>
          <input
            type="number"
            value={formData.expected_roi}
            onChange={(e) => setFormData({ ...formData, expected_roi: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            Location Preference
          </label>
          <input
            type="text"
            value={formData.location_preference}
            onChange={(e) => setFormData({ ...formData, location_preference: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., South Delhi, Mumbai Suburbs"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          Business Experience
        </label>
        <textarea
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          placeholder="Describe your relevant business experience..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Saving...' : 'Submit Interest'}
      </button>
    </form>
  );
}