import { useState, useEffect } from 'react';
import { supabase, subscribeToChannel } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export function useRealtimeProposals(user: User) {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initial fetch
    const fetchProposals = async () => {
      try {
        const { data, error } = await supabase
          .from('business_proposals')
          .select(`
            *,
            investor:profiles!business_proposals_investor_id_fkey (
              id,
              full_name,
              contact_info
            )
          `)
          .or(`user_id.eq.${user.id},investor_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) setProposals(data || []);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        toast.error('Failed to load proposals');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProposals();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToChannel(
      `proposals-${user.id}`,
      'business_proposals',
      async (payload) => {
        const { eventType, new: newRecord } = payload;

        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          // Fetch the complete record with joins
          const { data, error } = await supabase
            .from('business_proposals')
            .select(`
              *,
              investor:profiles!business_proposals_investor_id_fkey (
                id,
                full_name,
                contact_info
              )
            `)
            .eq('id', newRecord.id)
            .single();

          if (!error && data) {
            setProposals(current => {
              const index = current.findIndex(p => p.id === data.id);
              if (index >= 0) {
                return [
                  ...current.slice(0, index),
                  data,
                  ...current.slice(index + 1)
                ];
              }
              return [data, ...current];
            });
          }
        }
      },
      `user_id=eq.${user.id},investor_id=eq.${user.id}`
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [user.id]);

  return { proposals, loading };
}