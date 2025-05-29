import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { InvestorsSwiper } from './InvestorsSwiper';
import { Building2 } from 'lucide-react';

export function InvestorsList() {
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvestors = async () => {
      try {
        setLoading(true);
        
        // Get all business interests with profile information
        const { data: interests, error: interestsError } = await supabase
          .from('business_interests')
          .select(`
            *,
            profiles!business_interests_user_id_fkey (
              id,
              first_name,
              last_name,
              contact_info
            )
          `);

        if (interestsError) throw interestsError;

        // Format the data
        const formattedInvestors = interests
          ?.filter(interest => interest.profiles)
          .map(interest => ({
            id: interest.profiles.id,
            full_name: `${interest.profiles.first_name} ${interest.profiles.last_name}` || 'Anonymous Investor',
            contact_info: {
              email: 'Contact available after proposal acceptance',
              phone: 'Contact available after proposal acceptance',
              preferred_contact_method: 'email'
            },
            business_interests: {
              id: interest.id,
              business_type: interest.business_type,
              investment_amount: interest.investment_amount,
              expected_roi: interest.expected_roi,
              location_preference: interest.location_preference,
              experience: interest.experience
            }
          }));

        setInvestors(formattedInvestors || []);
        setError(null);
      } catch (error: any) {
        console.error('Error loading investors:', error);
        setError('Failed to load investors');
        toast.error('Failed to load investors');
      } finally {
        setLoading(false);
      }
    };

    loadInvestors();

    // Subscribe to real-time changes
    const channel = supabase.channel('investors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_interests'
        },
        () => loadInvestors()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (investors.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No investors found</h3>
        <p className="mt-1 text-sm text-gray-500">Be the first to express interest in investing!</p>
      </div>
    );
  }

  return <InvestorsSwiper investors={investors} loading={loading} />;
}