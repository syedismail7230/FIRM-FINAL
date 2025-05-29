import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { LocationMap } from './LocationMap';
import { LocationSearch } from './LocationSearch';
import { BusinessSearch } from './BusinessSearch';
import { LocationAnalysis } from './LocationAnalysis';
import { BestStreetAnalysis } from './BestStreetAnalysis';
import { BusinessRecommendationsSwiper } from './BusinessRecommendationsSwiper';
import { FranchiseOpportunities } from './FranchiseOpportunities';
import { BusinessIdeaAnalysis } from './BusinessIdeaAnalysis';
import { InvestorsList } from './InvestorsList';
import { Download, AlertTriangle, WifiOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface UserDashboardProps {
  user: User;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [location, setLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
    name: 'New Delhi, India',
    population: 500000,
    avgIncome: 50000,
    businessDensity: 5,
    competitorCount: 3,
    educationLevel: 75,
    radius: 1
  });
  const [businessType, setBusinessType] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    checkApprovalStatus();
  }, [user.id]);

  const checkApprovalStatus = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .maybeSingle()
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Database error: ${error.message}`);
        setIsApproved(false);
        setConnectionError(true);
        return;
      }

      setIsApproved(data?.is_approved ?? false);
      setConnectionError(false);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error checking approval status:', error);
      setIsApproved(false);
      setConnectionError(true);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Unable to connect to the server. Please check your internet connection.');
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error('Request timed out. Please check your connection and try again.');
      } else {
        toast.error('An error occurred while checking approval status. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(prev => ({
      ...prev,
      lat,
      lng,
      name
    }));
  };

  const handleBusinessSearch = (query: string) => {
    setAnalyzing(true);
    setBusinessType(query);
    
    // This will trigger a search in the LocationMap component
    setTimeout(() => {
      setAnalyzing(false);
    }, 1500);
  };

  const handleAnalyticsUpdate = (data: any) => {
    setAnalytics(data);
    
    if (data.nearbyBusinesses) {
      setNearbyBusinesses(data.nearbyBusinesses);
    }
    
    // Update location data based on analytics
    if (data.totalBusinesses) {
      setLocation(prev => ({
        ...prev,
        businessDensity: data.businessDensity || prev.businessDensity,
        competitorCount: data.totalBusinesses || prev.competitorCount
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <WifiOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">
            Unable to connect to the server. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => checkApprovalStatus()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
          <p className="text-gray-600 mb-4">
            Your account is currently under review. You will be notified once an administrator approves your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Location Analysis</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <LocationSearch onLocationSelect={handleLocationSelect} />
            <BusinessSearch onSearch={handleBusinessSearch} isSearching={analyzing} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <LocationMap 
              location={location}
              radius={location.radius}
              businessType={businessType}
              nearbyBusinesses={nearbyBusinesses}
              onAnalyticsUpdate={handleAnalyticsUpdate}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <LocationAnalysis location={location} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <BestStreetAnalysis location={location} />
          </div>

          {businessType && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <BusinessIdeaAnalysis location={location} />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <FranchiseOpportunities location={location} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Potential Investors</h2>
            <InvestorsList />
          </div>
        </div>
      </div>
    </div>
  );
}