import { useState, useEffect } from 'react';
import { supabase, subscribeToChannel } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useRealtimeInvestors() {
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchInvestors = async () => {
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, contact_info');

        if (profilesError) throw profilesError;

        const { data: interests, error: interestsError } = await supabase
          .from('business_interests')
          .select('*')
          .in('user_id', profiles?.map(p => p.id) || []);

        if (interestsError) throw interestsError;

        const formattedInvestors = profiles?.map(profile => {
          const userInterests = interests?.find(i => i.user_id === profile.id);
          if (!userInterests) return null;

          return {
            id: profile.id,
            full_name: profile.full_name,
            contact_info: profile.contact_info || {
              email: 'Not provided',
              phone: 'Not provided',
              preferred_contact_method: 'email'
            },
            business_interests: {
              id: userInterests.id,
              business_type: userInterests.business_type,
              investment_amount: userInterests.investment_amount,
              expected_roi: userInterests.expected_roi,
              location_preference: userInterests.location_preference,
              experience: userInterests.experience
            }
          };
        }).filter(Boolean);

        if (mounted) {
          setInvestors(formattedInvestors || []);
        }
      } catch (error) {
        console.error('Error loading investors:', error);
        toast.error('Failed to load investors');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchInvestors();

    // Subscribe to profile changes
    const unsubscribeProfiles = subscribeToChannel(
      'profiles-updates',
      'profiles',
      () => fetchInvestors()
    );

    // Subscribe to business interests changes
    const unsubscribeInterests = subscribeToChannel(
      'interests-updates',
      'business_interests',
      () => fetchInvestors()
    );

    return () => {
      mounted = false;
      unsubscribeProfiles();
      unsubscribeInterests();
    };
  }, []);

  return { investors, loading };
}