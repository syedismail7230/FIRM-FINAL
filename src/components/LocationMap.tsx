import React, { useState, useEffect } from 'react';
import { MapView } from './map/MapView';
import { fetchLocationAnalytics, searchBusinessesByType } from '../utils/locationAnalytics';
import type { LocationData } from '../types';
import toast from 'react-hot-toast';

interface LocationMapProps {
  location: LocationData;
  radius: number;
  businessType?: string;
  nearbyBusinesses: any[];
  onAnalyticsUpdate: (analytics: any) => void;
}

export function LocationMap({ location, radius, businessType, nearbyBusinesses, onAnalyticsUpdate }: LocationMapProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    loadLocationData();
  }, [location.lat, location.lng, radius, businessType]);

  const loadLocationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsData, businessesData] = await Promise.all([
        fetchLocationAnalytics(location.lat, location.lng, radius),
        businessType ? searchBusinessesByType(location.lat, location.lng, radius, businessType) : Promise.resolve([])
      ]);

      onAnalyticsUpdate(analyticsData);
      setBusinesses(businessesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading location data:', error);
      setError('Failed to load location data');
      toast.error('Failed to load location data');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadLocationData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <MapView
      location={location}
      radius={radius}
      nearbyBusinesses={businesses.length > 0 ? businesses : nearbyBusinesses}
      onAnalyticsUpdate={onAnalyticsUpdate}
      isLoading={loading}
      businessType={businessType}
    />
  );
}