"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  coordinates: {
    lat: number | string;
    lng: number | string;
  };
  title?: string; // Make title optional
}

export default function PropertyMap({ coordinates, title }: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Convert coordinates to numbers
  const lat =
    typeof coordinates.lat === "string"
      ? parseFloat(coordinates.lat)
      : coordinates.lat;
  const lng =
    typeof coordinates.lng === "string"
      ? parseFloat(coordinates.lng)
      : coordinates.lng;

  // Fix for Leaflet marker icon in Next.js
  useEffect(() => {
    // Only run this code in the browser
    if (typeof window !== "undefined") {
      // Fix Leaflet default icon issue with webpack
      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      L.Marker.prototype.options.icon = DefaultIcon;

      setIsMounted(true);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <h2 className="text-xl font-semibold p-6">Location</h2>
        <div className="h-80 bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <h2 className="text-xl font-semibold p-6">Location</h2>
      <div className="h-80">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            {title && <Popup>{title}</Popup>}
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
