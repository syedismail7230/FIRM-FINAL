import { useState, useEffect } from 'react';
import { fetchLocationAnalytics } from '../utils/locationAnalytics';
import type { LocationData } from '../types';
import toast from 'react-hot-toast';

export function useRealtimeAnalytics(location: LocationData) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const updateInterval = 30000; // 30 seconds
    let timeoutId: NodeJS.Timeout;

    const fetchAnalytics = async () => {
      try {
        const data = await fetchLocationAnalytics(
          location.lat,
          location.lng,
          location.radius || 1
        );

        if (mounted) {
          setAnalytics(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        if (mounted) {
          setError('Failed to fetch analytics data');
          toast.error('Failed to update analytics');
        }
      } finally {
        if (mounted) {
          setLoading(false);
          timeoutId = setTimeout(fetchAnalytics, updateInterval);
        }
      }
    };

    fetchAnalytics();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location]);

  return { analytics, loading, error };
}