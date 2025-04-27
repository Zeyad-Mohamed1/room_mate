"use client";

import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { getAllProperties } from "@/actions/property-actions";
import { Property } from "@prisma/client";

// Dynamically import the Map component with no SSR
const MapWithNoSSR = dynamic(() => import("./PropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  useEffect(() => {
    async function loadProperties() {
      if (isOpen) {
        setLoading(true);
        try {
          const data = await getAllProperties();
          setProperties(data as Property[]);
        } catch (error) {
          console.error("Failed to load properties:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadProperties();
  }, [isOpen]);

  // Calculate center coordinates based on properties or use default
  const center =
    properties.length > 0 && properties[0].latitude && properties[0].longitude
      ? ([
          parseFloat(properties[0].latitude),
          parseFloat(properties[0].longitude),
        ] as [number, number])
      : ([30.0444, 31.2357] as [number, number]); // Default to Cairo coordinates

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 my-6 sm:my-8 bg-white rounded-xl shadow-xl overflow-hidden animate-scaleIn">
        <div className="absolute top-0 left-0 right-0 h-14 bg-white z-10 flex items-center justify-between px-4 sm:px-6 border-b">
          <h2 className="font-semibold text-gray-800">
            Browse {properties.length} Properties
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            aria-label="Close map"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="h-full w-full pt-14">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500">Loading property map...</p>
              </div>
            </div>
          ) : (
            <MapWithNoSSR
              center={center}
              zoom={12}
              properties={properties}
              selectedProperty={selectedProperty}
              onMarkerClick={setSelectedProperty}
            />
          )}
        </div>
      </div>
    </div>
  );
}
