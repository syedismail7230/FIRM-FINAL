import React, { useState, useEffect } from 'react';
import { Building2, MapPin, TrendingUp, Users, Store, Brain } from 'lucide-react';
import type { LocationData } from '../types';
import toast from 'react-hot-toast';

interface BestBusinessLocationsProps {
  location: LocationData;
}

export function BestBusinessLocations({ location }: BestBusinessLocationsProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Location Analysis</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-semibold">{location.name}</h3>
            </div>
            <p className="text-gray-600">Location Overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h4 className="font-medium">Demographics</h4>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Population</p>
                <p className="font-semibold">{location.population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Education Level</p>
                <p className="font-semibold">{location.educationLevel}%</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-5 h-5 text-indigo-600" />
              <h4 className="font-medium">Business Environment</h4>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Business Density</p>
                <p className="font-semibold">{location.businessDensity}/km²</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Competitors</p>
                <p className="font-semibold">{location.competitorCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h4 className="font-medium">Economic Indicators</h4>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Average Income</p>
                <p className="font-semibold">₹{location.avgIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Market Score</p>
                <p className="font-semibold">{Math.round((location.population / 100000) * (location.avgIncome / 50000) * 50)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}