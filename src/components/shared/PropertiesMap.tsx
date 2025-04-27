"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@prisma/client";

interface PropertiesMapProps {
  center: [number, number];
  zoom?: number;
  properties: Property[];
  selectedProperty?: Property | null;
  onMarkerClick?: (property: Property) => void;
}

// Custom marker icon
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

// Selected marker icon
const selectedIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `
    <div class="relative">
      <div class="absolute -top-8 -left-4 bg-white rounded-full p-2 shadow-lg transform-gpu transition-transform duration-200 scale-110">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold ring-4 ring-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div class="w-2 h-2 bg-blue-600 rotate-45"></div>
        </div>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 0],
  popupAnchor: [0, -20],
});

// Custom popup component
const CustomPopup = ({ property }: { property: Property }) => {
  return (
    <div className="min-w-[250px] overflow-hidden">
      <div className="relative h-36 mb-0">
        {property.images && property.images.length > 0 && (
          <Image
            fill
            src={property.images[0]}
            alt={property.title || "Property"}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-overlay pointer-events-none" />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-medium shadow-md">
          {property.price || "Price on request"}
        </div>
        <div className="absolute bottom-2 left-2">
          <h3 className="text-white font-bold text-lg drop-shadow-md truncate max-w-[200px]">
            {property.title || "Unnamed Property"}
          </h3>
          <p className="text-white/90 text-xs truncate max-w-[200px] drop-shadow-md">
            {property.address || "No address"}
          </p>
        </div>
      </div>
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <span className="font-medium">{property.type}</span>
            <span>•</span>
            <span>{property.totalRooms || "?"} rooms</span>
            <span>•</span>
            <span>{property.bathrooms || "?"} baths</span>
          </div>
          <div className="text-xs font-medium text-gray-800">
            {property.size || "?"} m²
          </div>
        </div>
        <Link
          href={`/property/${property.slug}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md flex items-center justify-center transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

// Map updater component
const MapUpdater = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

// Custom styles for markers and popups
const markerStyles = `
  .custom-marker-icon {
    background: transparent;
    border: none;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
  }
  
  .leaflet-popup-content {
    margin: 0;
  }
`;

// Add styles to document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = markerStyles;
  document.head.appendChild(style);
}

export default function PropertiesMap({
  center,
  zoom = 13,
  properties,
  selectedProperty,
  onMarkerClick,
}: PropertiesMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-xl"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} zoom={zoom} />

      {properties.map((property) => {
        if (!property.latitude || !property.longitude) return null;
        return (
          <Marker
            key={property.id}
            position={[
              parseFloat(property.latitude),
              parseFloat(property.longitude),
            ]}
            icon={
              property.id === selectedProperty?.id ? selectedIcon : customIcon
            }
            eventHandlers={{
              click: () => onMarkerClick?.(property),
            }}
          >
            <Popup>
              <CustomPopup property={property} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
