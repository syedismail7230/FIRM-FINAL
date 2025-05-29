import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Loader2, MapPin, Building2, Store, Coffee, School, Guitar as Hospital } from 'lucide-react';
import { searchLocation } from '../utils/locationSearch';
import type { SearchResult } from '../types';
import debounce from 'lodash/debounce';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchResults = await searchLocation(searchQuery);
        setResults(searchResults);
        setIsOpen(true);
      } catch (err) {
        console.error('Error searching locations:', err);
        setError('Failed to search locations');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchLocations(value);
  };

  const handleSelect = (result: SearchResult) => {
    onLocationSelect(
      result.lat,
      result.lon,
      result.display_name
    );
    setQuery(result.display_name);
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'restaurant':
      case 'cafe':
      case 'bar':
      case 'fast_food':
        return <Coffee className="w-4 h-4 text-blue-500" />;
      case 'shop':
      case 'supermarket':
      case 'convenience':
        return <Store className="w-4 h-4 text-green-500" />;
      case 'school':
      case 'university':
      case 'college':
        return <School className="w-4 h-4 text-yellow-500" />;
      case 'hospital':
      case 'clinic':
      case 'pharmacy':
        return <Hospital className="w-4 h-4 text-red-500" />;
      default:
        return <Building2 className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for a location..."
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {loading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {error && (
        <div className="absolute w-full mt-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {result.distance ? (
                    <MapPin className="w-4 h-4 text-gray-400" />
                  ) : (
                    getIcon(result.type)
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {result.name || result.display_name}
                  </div>
                  {result.distance && (
                    <div className="text-sm text-gray-500">
                      {result.distance.toFixed(1)} km away
                    </div>
                  )}
                  {result.address && (
                    <div className="text-sm text-gray-500">
                      {[
                        result.address.road,
                        result.address.city,
                        result.address.state
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}