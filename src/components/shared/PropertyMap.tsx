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

// Import marker icon images to fix the missing marker issue
const PropertyMap = ({
  initialPosition,
  onLocationSelect,
}: PropertyMapProps) => {
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

  return (
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
      <LocationPickerMarker onLocationSelect={onLocationSelect} />
      <ChangeMapView center={initialPosition} />
    </MapContainer>
  );
};

interface PropertyMapProps {
  initialPosition: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}

// Internal component to handle map clicks
const LocationPickerMarker = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>Property location</Popup>
    </Marker>
  );
};

export default PropertyMap;
