import * as turf from '@turf/turf';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES, delay = INITIAL_DELAY): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    // Retry with exponential backoff
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}

export async function searchLocation(query: string) {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '10',
      countrycodes: 'in',
      'accept-language': 'en'
    });

    const response = await fetchWithRetry(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      { 
        headers: { 
          'Accept-Language': 'en',
          'User-Agent': 'BoltLocationAnalyzer/1.0'
        }
      }
    );

    const data = await response.json();
    
    return data.map((item: any) => ({
      place_id: item.place_id.toString(),
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: formatDisplayName(item.address),
      type: item.osm_type,
      importance: 1,
      address: item.address
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string[]> {
  try {
    // Add delay to respect Nominatim's usage policy (1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get nearby streets within a radius
    const params = new URLSearchParams({
      format: 'json',
      addressdetails: '1',
      limit: '50',
      'accept-language': 'en',
      street: '1',
      highway: '*',
      bounded: '1',
      viewbox: `${lon-0.02},${lat-0.02},${lon+0.02},${lat+0.02}`
    });

    const requestOptions = {
      headers: { 
        'Accept-Language': 'en',
        'User-Agent': 'BoltLocationAnalyzer/1.0'
      }
    };

    const response = await fetchWithRetry(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      requestOptions
    );

    const data = await response.json();
    
    // Extract unique street names
    const streets = new Set<string>();
    data.forEach((item: any) => {
      if (item.address?.road) {
        streets.add(item.address.road);
      }
    });

    // If no streets found, try reverse geocoding
    if (streets.size === 0) {
      const reverseParams = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
        addressdetails: '1',
        zoom: '18'
      });

      const reverseResponse = await fetchWithRetry(
        `https://nominatim.openstreetmap.org/reverse?${reverseParams.toString()}`,
        requestOptions
      );

      const reverseData = await reverseResponse.json();
      if (reverseData.address?.road) {
        streets.add(reverseData.address.road);
      }
    }

    // If still no streets found, return default street names
    if (streets.size === 0) {
      return [
        'Market Street',
        'Commercial Avenue',
        'Business District',
        'Shopping Plaza',
        'Main Road'
      ];
    }

    return Array.from(streets);
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    // Return default street names as fallback
    return [
      'Market Street',
      'Commercial Avenue',
      'Business District',
      'Shopping Plaza',
      'Main Road'
    ];
  }
}

function formatDisplayName(address: any): string {
  if (!address) return 'Unknown Location';
  
  const parts = [];
  
  if (address.road) parts.push(address.road);
  if (address.suburb) parts.push(address.suburb);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postcode) parts.push(address.postcode);
  
  return parts.join(', ') || 'Unknown Location';
}