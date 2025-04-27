"use client";

import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  BedDouble,
  Home,
  Flag,
  Badge,
  Share2,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useFavorite } from "@/hooks/useFavorite";
import { toast } from "react-hot-toast";
import PropertyRating from "./PropertyRating";

interface PropertyHeaderProps {
  title: string;
  location: string;
  type: "house" | "room";
  roomType: "mixed" | "single";
  propertyId: string;
  rating: number;
  totalRatings: number;
}

export default function PropertyHeader({
  title,
  location,
  type,
  roomType,
  propertyId,
  rating,
  totalRatings,
}: PropertyHeaderProps) {
  // Extract country for flag if possible
  const countryCode = location.split(",").pop()?.trim().toLowerCase() || "us";

  const { isFavorite, isLoading, toggleFavorite } = useFavorite({ propertyId });

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="relative mb-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Properties</span>
      </Link>

      {/* Property Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareClick}
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </button>
          <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <Heart
              className={`h-4 w-4 mr-1.5 ${
                isFavorite ? "text-red-500 fill-current" : ""
              }`}
            />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Property info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1.5" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-600">
            {type === "house" ? (
              <Home className="h-4 w-4 mr-1.5" />
            ) : (
              <BedDouble className="h-4 w-4 mr-1.5" />
            )}
            <span>
              {type === "house" ? "House" : "Room"} •{" "}
              {roomType === "mixed" ? "Mixed" : "Single"}
            </span>
          </div>

          {/* Property Rating */}
          {totalRatings > 0 ? (
            <PropertyRating rating={rating} totalRatings={totalRatings} />
          ) : (
            <PropertyRating rating={0} totalRatings={0} />
          )}
        </div>
      </div>
    </div>
  );
}
