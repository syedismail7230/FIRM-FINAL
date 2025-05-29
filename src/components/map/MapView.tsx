import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Map, { Marker, Popup, Source, Layer, CircleLayer } from 'react-map-gl';
import type { LocationData } from '../../types';
import { Store, Users, TrendingUp, AlertTriangle, Coffee, School, Guitar as Hospital, Building2, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { AnalyticsUpdater } from './AnalyticsUpdater';
import toast from 'react-hot-toast';

interface MapViewProps {
  location: LocationData;
  radius: number;
  nearbyBusinesses: any[];
  onAnalyticsUpdate: (analytics: any) => void;
  isLoading?: boolean;
  businessType?: string;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

if (!MAPBOX_TOKEN) {
  throw new Error('Mapbox access token is required');
}

const circleLayer: CircleLayer = {
  id: 'search-radius',
  type: 'circle',
  paint: {
    'circle-radius': ['*', ['get', 'radius'], 100],
    'circle-color': '#4f46e5',
    'circle-opacity': 0.1,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#4f46e5'
  }
};

export function MapView({ location, radius, nearbyBusinesses, onAnalyticsUpdate, isLoading, businessType }: MapViewProps) {
  const [viewport, setViewport] = useState({
    latitude: location.lat,
    longitude: location.lng,
    zoom: 13
  });
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  // Memoize the search radius GeoJSON to prevent unnecessary recalculations
  const searchRadiusGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          radius: radius * 1000
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        }
      }
    ]
  }), [location.lat, location.lng, radius]);

  // Memoize marker icon getter
  const getMarkerIcon = useCallback((type: string) => {
    switch (type?.toLowerCase()) {
      case 'restaurant':
      case 'cafe':
      case 'bar':
      case 'fast_food':
        return <Coffee className="w-4 h-4 text-blue-600" />;
      case 'school':
      case 'university':
      case 'college':
        return <School className="w-4 h-4 text-yellow-600" />;
      case 'hospital':
      case 'clinic':
      case 'pharmacy':
        return <Hospital className="w-4 h-4 text-red-600" />;
      case 'shop':
      case 'supermarket':
      case 'convenience':
      case 'copyshop':
        return <Store className="w-4 h-4 text-green-600" />;
      default:
        return <Building2 className="w-4 h-4 text-gray-600" />;
    }
  }, []);

  // Memoize business match checker
  const isBusinessMatch = useCallback((business: any) => {
    if (!businessType) return false;
    const searchTerms = businessType.toLowerCase().split(/\s+/);
    const businessName = business.name?.toLowerCase() || '';
    const businessCategory = business.type?.toLowerCase() || '';
    
    return searchTerms.some(term => 
      businessName.includes(term) || 
      businessCategory.includes(term)
    );
  }, [businessType]);

  // Update viewport when location changes
  useEffect(() => {
    setViewport({
      latitude: location.lat,
      longitude: location.lng,
      zoom: 13
    });
  }, [location.lat, location.lng]);

  if (isLoading) {
    return (
      <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading location data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md relative">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        reuseMaps
        maxZoom={20}
        minZoom={3}
      >
        <Source type="geojson" data={searchRadiusGeoJSON}>
          <Layer {...circleLayer} />
        </Source>

        <Marker
          longitude={location.lng}
          latitude={location.lat}
          anchor="bottom"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg transform -translate-y-1/2">
            <MapPin className="w-5 h-5" />
          </div>
        </Marker>

        {nearbyBusinesses.map((business, index) => {
          if (!business.lat || !business.lon) return null;
          
          const isMatch = isBusinessMatch(business);
          return (
            <Marker
              key={`${business.id}-${index}`}
              longitude={business.lon}
              latitude={business.lat}
              anchor="bottom"
            >
              <div 
                className={`w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border-2 transition-all duration-300 cursor-pointer
                  ${isMatch ? 'border-green-500 animate-pulse shadow-lg scale-125' : 'border-indigo-600'}
                  hover:scale-110`}
                onClick={() => setSelectedBusiness(business)}
              >
                {getMarkerIcon(business.type)}
              </div>
            </Marker>
          );
        })}

        {selectedBusiness && (
          <Popup
            longitude={selectedBusiness.lon}
            latitude={selectedBusiness.lat}
            anchor="bottom"
            onClose={() => setSelectedBusiness(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold mb-2">{selectedBusiness.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedBusiness.type}</p>
              {selectedBusiness.businessHours && (
                <p className="text-sm text-gray-600 mb-2">
                  {selectedBusiness.businessHours}
                </p>
              )}
              {selectedBusiness.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedBusiness.amenities.map((amenity: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Popup>
        )}

        <AnalyticsUpdater 
          location={location} 
          onAnalyticsUpdate={onAnalyticsUpdate} 
        />
      </Map>
    </div>
  );
}