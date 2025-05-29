import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface BusinessSearchProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export function BusinessSearch({ onSearch, isSearching }: BusinessSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search business type (e.g., restaurant, cafe)..."
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className={`absolute inset-y-0 right-0 flex items-center px-4 text-sm text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isSearching ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}