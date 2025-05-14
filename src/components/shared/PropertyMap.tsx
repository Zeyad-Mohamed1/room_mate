"use client";
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `
      <div class="relative">
        <div class="absolute -top-8 -left-4 bg-white rounded-full p-2 shadow-lg transform-gpu transition-transform duration-200 hover:scale-110">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div class="w-2 h-2 bg-blue-500 rotate-45"></div>
          </div>
        </div>
      </div>
    `,
  iconSize: [40, 40],
  iconAnchor: [20, 0],
  popupAnchor: [0, -20],
});

// MapCentering component that will update the map view when initialPosition changes
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
};

// Function to get the coordinates from a location name using Nominatim
const getCoordinatesFromAddress = async (query: string): Promise<Array<{ lat: number; lng: number; display_name: string }> | undefined> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=en`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PropertyApp/1.0' // Custom user agent to comply with Nominatim usage policy
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding service failed');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        display_name: item.display_name
      }));
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return undefined;
  }
};

interface PropertyMapProps {
  initialPosition: [number, number];
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
}

// Function to get the address using reverse geocoding from Nominatim
const getAddressFromLatLng = async (lat: number, lng: number): Promise<string | undefined> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PropertyApp/1.0' // Custom user agent to comply with Nominatim usage policy
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding service failed');
    }

    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return undefined;
  }
};

// Search component that appears on the map
const MapSearch = ({ onSearch }: { onSearch: (result: { lat: number; lng: number; display_name: string }) => void }) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Array<{ lat: number; lng: number; display_name: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const searchResults = await getCoordinatesFromAddress(query);
      if (searchResults && searchResults.length > 0) {
        setResults(searchResults);
      } else {
        setResults([]);
        setError('No results found');
      }
    } catch (error) {
      setError('Search failed');
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleResultClick = (result: { lat: number; lng: number; display_name: string }) => {
    onSearch(result);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-[1000] bg-white shadow-lg rounded-lg p-2">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={searching}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary/90 transition-colors"
          disabled={searching}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {results.length > 0 && (
        <div className="mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleResultClick(result)}
              >
                <p className="text-sm truncate">{result.display_name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Internal component to handle map clicks and marker positioning
const LocationPickerMarker = ({
  onLocationSelect,
  initialPosition,
}: {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialPosition: [number, number];
}) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition);

  // Update position when initialPosition prop changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Get address from the coordinates using reverse geocoding
      const address = await getAddressFromLatLng(lat, lng);

      // Pass coordinates and address to parent component
      onLocationSelect(lat, lng, address);
    },
  });

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>Selected Property Location</Popup>
    </Marker>
  );
};

// Main PropertyMap component
const PropertyMap = ({
  initialPosition,
  onLocationSelect,
}: PropertyMapProps) => {
  const [mapPosition, setMapPosition] = useState<[number, number]>(initialPosition);
  const mapRef = useRef<L.Map | null>(null);

  // Fix for the missing marker icon issue
  useEffect(() => {
    // Fix Leaflet marker icons
    const L = require("leaflet");

    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  // Handle search result selection
  const handleSearchResult = ({ lat, lng, display_name }: { lat: number; lng: number; display_name: string }) => {
    setMapPosition([lat, lng]);
    onLocationSelect(lat, lng, display_name);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={initialPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPickerMarker
          onLocationSelect={onLocationSelect}
          initialPosition={mapPosition}
        />
        <ChangeMapView center={mapPosition} />
      </MapContainer>
      <MapSearch onSearch={handleSearchResult} />
    </div>
  );
};

export default PropertyMap;
