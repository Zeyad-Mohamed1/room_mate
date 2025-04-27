"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BedDouble,
  Home,
  X,
  ChevronLeft,
  ChevronRight,
  Expand,
  Camera,
} from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  activeImage: number;
  setActiveImage: (index: number) => void;
  type: "house" | "room";
  roomType: "mixed" | "single";
}

export default function PropertyGallery({
  images,
  activeImage,
  setActiveImage,
  type,
  roomType,
}: PropertyGalleryProps) {
  const [fullScreen, setFullScreen] = useState(false);

  const nextImage = () => {
    setActiveImage((activeImage + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((activeImage - 1 + images.length) % images.length);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  // Gallery in normal view
  if (!fullScreen) {
    return (
      <div className="relative">
        <div className="relative h-[400px] sm:h-[500px] w-full">
          <Image
            src={images[activeImage] || "/images/properties/placeholder.jpg"}
            alt="Property image"
            fill
            className="object-cover"
            priority
          />

          {/* Property type badge */}
          <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
            {type === "house" ? (
              <Home className="h-4 w-4" />
            ) : (
              <BedDouble className="h-4 w-4" />
            )}
            {type === "house" ? "House" : "Room"} •{" "}
            {roomType === "mixed" ? "Mixed" : "Single"}
          </div>

          {/* Image count indicator */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
            <Camera className="h-4 w-4" />
            {activeImage + 1} / {images.length}
          </div>

          {/* Full-screen button */}
          <button
            onClick={toggleFullScreen}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="View full screen"
          >
            <Expand className="h-5 w-5" />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 p-2 space-x-2 bg-gray-50">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden ${
                  activeImage === index
                    ? "ring-2 ring-blue-500"
                    : "ring-1 ring-gray-200 opacity-70 hover:opacity-100 transition-opacity"
                }`}
              >
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Gallery in full-screen view
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <p className="text-white">
          {activeImage + 1} / {images.length}
        </p>

        <button
          onClick={toggleFullScreen}
          className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close full screen"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <Image
          src={images[activeImage] || "/images/properties/placeholder.jpg"}
          alt="Property image"
          fill
          className="object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </>
        )}
      </div>

      <div className="p-4 overflow-x-auto hide-scrollbar bg-black/90">
        <div className="flex space-x-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden ${
                activeImage === index
                  ? "ring-2 ring-blue-500"
                  : "opacity-50 hover:opacity-80 transition-opacity"
              }`}
            >
              <Image
                src={image}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
