import { useEffect, useCallback } from 'react';
import { useMap } from 'react-map-gl';
import { fetchLocationAnalytics } from '../../utils/locationAnalytics';
import type { LocationData } from '../../types';

interface AnalyticsUpdaterProps {
  location: LocationData;
  onAnalyticsUpdate: (analytics: any) => void;
}

export function AnalyticsUpdater({ location, onAnalyticsUpdate }: AnalyticsUpdaterProps) {
  const map = useMap();
  
  const updateAnalytics = useCallback(async () => {
    try {
      const data = await fetchLocationAnalytics(
        location.lat,
        location.lng,
        location.radius || 1
      );
      
      if (data) {
        onAnalyticsUpdate(data);
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  }, [location, onAnalyticsUpdate]);

  // Update analytics when location changes
  useEffect(() => {
    updateAnalytics();
  }, [location.lat, location.lng, location.radius, updateAnalytics]);

  // Update map view when location changes
  useEffect(() => {
    if (map && map.current) {
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 14,
        duration: 1000
      });
    }
  }, [location.lat, location.lng, map]);

  return null;
}